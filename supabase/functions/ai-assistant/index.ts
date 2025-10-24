// AI Assistant Edge Function
// Provides AI assistant functionality for all employees

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface AssistantMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AssistantRequest {
  message: string;
  conversationId?: string;
  channelContext?: string;
  employeeId: string;
}

interface AssistantResponse {
  success: boolean;
  response?: string;
  error?: string;
  conversationId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message, conversationId, channelContext, employeeId }: AssistantRequest = await req.json();

    if (!message || !employeeId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Message and employeeId are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get conversation history if provided
    let conversationHistory: AssistantMessage[] = [];
    if (conversationId) {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Fetch conversation history
      const { data: messages, error } = await supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10); // Last 10 messages for context

      if (!error && messages) {
        conversationHistory = messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content
        }));
      }
    }

    // Build system prompt with company context
    const systemPrompt = `You are an AI assistant for Veriton.io employees. You help with work-related questions, provide company information, and assist with daily tasks. Be professional, helpful, and concise.

    Context: ${channelContext || 'General company assistance'}
    
    Guidelines:
    - Be helpful and professional
    - Provide accurate information
    - If you don't know something, say so
    - Keep responses concise and relevant
    - Focus on work-related assistance`;

    // Prepare messages for the AI API
    const messages: AssistantMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.filter(msg => msg.role !== 'system'),
      { role: 'user', content: message }
    ];

    // Call MiniMax API
    const minimaxApiKey = Deno.env.get('MINIMAX_API_KEY');
    if (!minimaxApiKey) {
      throw new Error('MINIMAX_API_KEY not configured');
    }

    const minimaxResponse = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${minimaxApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'abab6.5s-chat',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!minimaxResponse.ok) {
      throw new Error(`MiniMax API error: ${minimaxResponse.status}`);
    }

    const aiData = await minimaxResponse.json();
    const aiResponse = aiData.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';

    // Store the conversation in database
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let finalConversationId = conversationId;

    if (!conversationId) {
      // Create new conversation
      const { data: newConversation } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: employeeId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          status: 'active',
          model_config: {
            model: 'abab6.5s-chat',
            temperature: 0.7,
            max_tokens: 1000
          }
        })
        .select('id')
        .single();

      finalConversationId = newConversation?.id;
    }

    // Store messages in database
    if (finalConversationId) {
      // Store user message
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: finalConversationId,
          role: 'user',
          content: message,
          model_used: 'abab6.5s-chat'
        });

      // Store assistant response
      await supabase
        .from('ai_messages')
        .insert({
          conversation_id: finalConversationId,
          role: 'assistant',
          content: aiResponse,
          model_used: 'abab6.5s-chat'
        });

      // Update conversation metadata
      await supabase
        .from('ai_conversations')
        .update({
          total_messages: 2,
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', finalConversationId);
    }

    const response: AssistantResponse = {
      success: true,
      response: aiResponse,
      conversationId: finalConversationId
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Assistant Error:', error);
    
    const errorResponse: AssistantResponse = {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});