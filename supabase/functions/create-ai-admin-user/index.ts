Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const requestData = await req.json();
        const { email, password, role = 'ai_admin', adminId } = requestData;
        
        if (!email || !password) {
            return new Response(JSON.stringify({
                error: { code: 'MISSING_PARAMS', message: 'Email and password are required' }
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Verify admin permissions for the requesting admin
        const adminRoleResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${adminId}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            }
        });

        const adminRoles = await adminRoleResponse.json();
        const adminRole = adminRoles[0];

        if (!adminRole || !['super_admin'].includes(adminRole.role)) {
            return new Response(JSON.stringify({
                error: { code: 'UNAUTHORIZED', message: 'Super Admin privileges required to create admin users' }
            }), {
                status: 403,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Create user using Supabase Admin API
        const createUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey
            },
            body: JSON.stringify({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: { 
                    role: role,
                    created_by_admin: adminId,
                    created_at: new Date().toISOString()
                }
            })
        });

        if (!createUserResponse.ok) {
            const errorText = await createUserResponse.text();
            throw new Error(`Failed to create user: ${errorText}`);
        }

        const userData = await createUserResponse.json();
        const createdUserId = userData.id;

        // Insert user role into user_roles table
        const insertRoleResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: createdUserId,
                role: role,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        if (!insertRoleResponse.ok) {
            // If role insertion fails, try to clean up the created user
            await fetch(`${supabaseUrl}/auth/v1/admin/users/${createdUserId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });
            
            throw new Error('Failed to create user role, user creation rolled back');
        }

        // Log the admin user creation
        console.log(`Super Admin ${adminId} created new ${role} user: ${email} (${createdUserId})`);

        return new Response(JSON.stringify({
            success: true,
            message: `${role} user created successfully`,
            user: {
                id: userData.id,
                email: userData.email,
                role: role,
                created_at: userData.created_at,
                created_by: adminId
            },
            timestamp: new Date().toISOString()
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'CREATE_ADMIN_USER_ERROR',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});