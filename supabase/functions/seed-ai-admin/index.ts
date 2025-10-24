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
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Missing Supabase configuration');
        }

        // Default AI Admin credentials
        const adminEmail = 'ai-admin@veriton.io';
        const adminPassword = 'VeritonAI2025!';
        
        // Check if admin already exists
        const existingUserResponse = await fetch(`${supabaseUrl}/rest/v1/auth.users?email=eq.${adminEmail}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        const existingUsers = await existingUserResponse.json();
        
        if (existingUsers.length > 0) {
            return new Response(JSON.stringify({
                success: true,
                message: 'AI Admin user already exists',
                existing_user: {
                    email: adminEmail,
                    id: existingUsers[0].id
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Create AI Admin user
        const createUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey
            },
            body: JSON.stringify({
                email: adminEmail,
                password: adminPassword,
                email_confirm: true,
                user_metadata: { 
                    role: 'ai_admin',
                    created_by: 'system',
                    created_at: new Date().toISOString()
                }
            })
        });

        if (!createUserResponse.ok) {
            const errorText = await createUserResponse.text();
            throw new Error(`Failed to create AI Admin user: ${errorText}`);
        }

        const userData = await createUserResponse.json();
        const adminUserId = userData.id;

        // Insert AI Admin role into user_roles table
        const insertRoleResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: adminUserId,
                role: 'ai_admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        if (!insertRoleResponse.ok) {
            // Clean up the created user
            await fetch(`${supabaseUrl}/auth/v1/admin/users/${adminUserId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            });
            
            throw new Error('Failed to create AI Admin role');
        }

        // Create employee record for AI Admin
        const insertEmployeeResponse = await fetch(`${supabaseUrl}/rest/v1/employees`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: adminUserId,
                full_name: 'AI Administrator',
                email: adminEmail,
                department: 'System Administration',
                position: 'AI Administrator',
                access_level: 'ai_admin',
                is_active: true,
                created_at: new Date().toISOString()
            })
        });

        if (!insertEmployeeResponse.ok) {
            console.warn('Failed to create employee record for AI Admin');
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'AI Admin user created successfully',
            admin_user: {
                email: adminEmail,
                password: adminPassword,
                id: adminUserId,
                role: 'ai_admin'
            },
            login_instructions: {
                url: '/ai-admin',
                credentials: {
                    email: adminEmail,
                    password: adminPassword
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'SEED_AI_ADMIN_ERROR',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});