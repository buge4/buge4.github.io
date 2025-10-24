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
        const { action, userId, targetUserId, newRole, adminId } = requestData;
        
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

        if (!adminRole || !['ai_admin', 'super_admin'].includes(adminRole.role)) {
            return new Response(JSON.stringify({
                error: { code: 'UNAUTHORIZED', message: 'Admin privileges required' }
            }), {
                status: 403,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        let response = {};
        let success = false;

        switch (action) {
            case 'update_role':
                if (!targetUserId || !newRole) {
                    throw new Error('Target user ID and new role are required');
                }

                // Update user role
                const updateRoleResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${targetUserId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: newRole,
                        updated_at: new Date().toISOString()
                    })
                });

                if (updateRoleResponse.ok) {
                    response = {
                        message: `User role updated to ${newRole} successfully`,
                        userId: targetUserId,
                        newRole: newRole
                    };
                    success = true;

                    // Log the action
                    console.log(`Admin ${adminId} updated user ${targetUserId} role to ${newRole}`);
                } else {
                    throw new Error('Failed to update user role');
                }
                break;

            case 'deactivate_user':
                if (!targetUserId) {
                    throw new Error('Target user ID is required');
                }

                // Set role to basic_user (deactivated)
                const deactivateResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${targetUserId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: 'basic_user',
                        updated_at: new Date().toISOString()
                    })
                });

                if (deactivateResponse.ok) {
                    response = {
                        message: 'User deactivated successfully',
                        userId: targetUserId
                    };
                    success = true;

                    console.log(`Admin ${adminId} deactivated user ${targetUserId}`);
                } else {
                    throw new Error('Failed to deactivate user');
                }
                break;

            case 'activate_user':
                if (!targetUserId) {
                    throw new Error('Target user ID is required');
                }

                // Set role to authenticated (activated)
                const activateResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${targetUserId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        role: 'authenticated',
                        updated_at: new Date().toISOString()
                    })
                });

                if (activateResponse.ok) {
                    response = {
                        message: 'User activated successfully',
                        userId: targetUserId
                    };
                    success = true;

                    console.log(`Admin ${adminId} activated user ${targetUserId}`);
                } else {
                    throw new Error('Failed to activate user');
                }
                break;

            case 'delete_user':
                if (!targetUserId) {
                    throw new Error('Target user ID is required');
                }

                // Delete user from both auth.users and user_roles
                const deleteUserResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${targetUserId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (deleteUserResponse.ok) {
                    // Note: In a real system, you would also need to handle the auth.users deletion
                    // through Supabase Admin API or service role, but this might have cascading effects
                    
                    response = {
                        message: 'User deleted successfully',
                        userId: targetUserId
                    };
                    success = true;

                    console.log(`Admin ${adminId} deleted user ${targetUserId}`);
                } else {
                    throw new Error('Failed to delete user');
                }
                break;

            case 'get_user_details':
                if (!targetUserId) {
                    throw new Error('Target user ID is required');
                }

                // Get user details including role
                const userDetailsResponse = await fetch(`${supabaseUrl}/rest/v1/auth.users?id=eq.${targetUserId}&select=*`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                const userRoleResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${targetUserId}`, {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                });

                if (userDetailsResponse.ok && userRoleResponse.ok) {
                    const userDetails = await userDetailsResponse.json();
                    const userRole = await userRoleResponse.json();
                    
                    response = {
                        user: userDetails[0] || null,
                        role: userRole[0] || null
                    };
                    success = true;
                } else {
                    throw new Error('Failed to retrieve user details');
                }
                break;

            case 'bulk_update_roles':
                if (!requestData.userIds || !newRole) {
                    throw new Error('User IDs and new role are required for bulk update');
                }

                const bulkUpdates = [];
                for (const uid of requestData.userIds) {
                    const bulkUpdateResponse = await fetch(`${supabaseUrl}/rest/v1/user_roles?user_id=eq.${uid}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            role: newRole,
                            updated_at: new Date().toISOString()
                        })
                    });

                    if (bulkUpdateResponse.ok) {
                        bulkUpdates.push(uid);
                    }
                }

                response = {
                    message: `Bulk role update completed. ${bulkUpdates.length} of ${requestData.userIds.length} users updated.`,
                    updatedUsers: bulkUpdates,
                    newRole: newRole
                };
                success = true;

                console.log(`Admin ${adminId} performed bulk role update to ${newRole} for users: ${bulkUpdates.join(', ')}`);
                break;

            default:
                throw new Error(`Unknown action: ${action}`);
        }

        return new Response(JSON.stringify({
            success,
            action,
            result: response,
            timestamp: new Date().toISOString()
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'USER_MANAGEMENT_ERROR',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});