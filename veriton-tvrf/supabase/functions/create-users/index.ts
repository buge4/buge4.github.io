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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        
        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Missing Supabase configuration');
        }

        // Users to create
        const users = [
            {
                email: 'bvhauge@gmail.com',
                password: 'Trysil416!',
                role: 'admin'
            },
            {
                email: 'user2@veriton.io',
                password: 'Veriton2024!',
                role: 'employee'
            },
            {
                email: 'user3@veriton.io',
                password: 'Veriton2024!',
                role: 'employee'
            },
            {
                email: 'user4@veriton.io',
                password: 'Veriton2024!',
                role: 'employee'
            }
        ];

        const results = [];

        for (const user of users) {
            try {
                // Create user using Supabase Admin API
                const createUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'application/json',
                        'apikey': serviceRoleKey
                    },
                    body: JSON.stringify({
                        email: user.email,
                        password: user.password,
                        email_confirm: true,
                        user_metadata: {
                            role: user.role
                        }
                    })
                });

                const userData = await createUserResponse.json();

                if (!createUserResponse.ok) {
                    console.error(`Failed to create user ${user.email}:`, userData);
                    results.push({
                        email: user.email,
                        success: false,
                        error: userData.message || 'Unknown error'
                    });
                    continue;
                }

                // Insert employee record
                const insertEmployeeResponse = await fetch(`${supabaseUrl}/rest/v1/employees`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'Content-Type': 'application/json',
                        'apikey': serviceRoleKey,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        user_id: userData.id,
                        email: user.email,
                        full_name: user.email.split('@')[0],
                        department: 'Technology',
                        position: user.role === 'admin' ? 'Administrator' : 'Employee',
                        access_level: user.role,
                        is_active: true
                    })
                });

                if (!insertEmployeeResponse.ok) {
                    const errorData = await insertEmployeeResponse.json();
                    console.error(`Failed to create employee record for ${user.email}:`, errorData);
                }

                results.push({
                    email: user.email,
                    success: true,
                    user_id: userData.id,
                    role: user.role
                });

            } catch (error) {
                console.error(`Error creating user ${user.email}:`, error);
                results.push({
                    email: user.email,
                    success: false,
                    error: error.message
                });
            }
        }

        // Create default channels
        try {
            const channelResponse = await fetch(`${supabaseUrl}/rest/v1/chat_channels`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json',
                    'apikey': serviceRoleKey,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify([
                    {
                        name: 'general',
                        type: 'group',
                        created_by: 'system'
                    },
                    {
                        name: 'announcements',
                        type: 'group',
                        created_by: 'system'
                    }
                ])
            });

            if (channelResponse.ok) {
                const channels = await channelResponse.json();
                
                // Add all users to general channel
                for (const result of results.filter(r => r.success)) {
                    await fetch(`${supabaseUrl}/rest/v1/chat_channel_members`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'Content-Type': 'application/json',
                            'apikey': serviceRoleKey,
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({
                            channel_id: channels[0].id,
                            user_id: result.user_id
                        })
                    });
                }
            }
        } catch (error) {
            console.error('Error creating channels:', error);
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'User creation completed',
            results: results,
            total_created: results.filter(r => r.success).length,
            total_failed: results.filter(r => !r.success).length
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error in user creation function:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
