// Edge function for AI coach chatbot
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, playerContext, requestType, questContext, activeQuests, breakdownQuest } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build concise system prompt
    let systemPrompt = `You are Sage, an AI productivity coach. Be concise, direct, and helpful like ChatGPT.

Player: Level ${playerContext.level} | ${playerContext.xp} XP | ${playerContext.completedQuests || 0} quests done | ${playerContext.streak || 0}-day streak
${playerContext.topSkills ? `Top Skills: ${playerContext.topSkills}` : ''}

Communication Style:
- Keep responses under 3 short paragraphs (max 100 words total)
- Be direct and actionable
- Use casual, friendly tone
- Reference their stats when relevant
- Skip unnecessary greetings after first message

Response Format:
1. Quick acknowledgment (1 sentence)
2. Main advice (2-3 sentences)
3. Next action (1 sentence)

Skip long explanations. Get to the point fast.`;

    if (requestType === 'breakdown') {
      systemPrompt += `\n\nBreak "${breakdownQuest.name}" (${breakdownQuest.category}) into 3-5 simple steps. Each step should be clear and doable in 30-60 min.${breakdownQuest.description ? `\nContext: ${breakdownQuest.description}` : ''}`;
    } else if (requestType === 'smart_reminder') {
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.priority}, ${q.xp} XP${q.dueDate ? `, due ${new Date(q.dueDate).toLocaleDateString()}` : ''})`).join('\n') || 'None'}\n\nRecommend ONE quest to start now and why (1-2 sentences).`;
    } else if (requestType === 'suggest') {
      systemPrompt += `\n\nSuggest 3-5 specific quests for Level ${playerContext.level}. Consider their skills: ${playerContext.topSkills || 'balanced'}. Current quests: ${activeQuests?.map((q: any) => `${q.name} (${q.category})`).join(', ') || 'None'}. Be specific, not generic.`;
    } else if (requestType === 'review') {
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority})`).join('\n') || 'None'}\n\nGive 2-3 quick tips to balance their quest load better.`;
    } else if (questContext) {
      systemPrompt += `\n\nQuest: "${questContext.name}" (${questContext.category}, ${questContext.priority}, ${questContext.xp} XP)${questContext.description ? `\nDetails: ${questContext.description}` : ''}\n\nGive quick advice: best approach and first action (2-3 sentences).`;
    } else {
      systemPrompt += `\n\nGeneral chat mode. Be conversational and helpful. Reference their stats when relevant. Keep it under 100 words.`;
    }

    console.log('Calling AI coach with context:', { playerContext, requestType, breakdownQuest: !!breakdownQuest });

    const requestBody: any = {
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: true,
    };

    // Add tool calling for quest suggestions and breakdowns
    if (requestType === 'breakdown') {
      requestBody.tools = [
        {
          type: "function",
          function: {
            name: "breakdown_quest",
            description: "Return 3-5 subtasks for breaking down a quest",
            parameters: {
              type: "object",
              properties: {
                subtasks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Clear, actionable subtask description" }
                    },
                    required: ["name"],
                    additionalProperties: false
                  }
                }
              },
              required: ["subtasks"],
              additionalProperties: false
            }
          }
        }
      ];
      requestBody.tool_choice = { type: "function", function: { name: "breakdown_quest" } };
    } else if (requestType === 'suggest') {
      requestBody.tools = [
        {
          type: "function",
          function: {
            name: "suggest_quests",
            description: "Return 3-5 actionable quest suggestions based on player analysis.",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Quest name" },
                      category: { type: "string", description: "Quest category" },
                      priority: { type: "string", enum: ["low", "medium", "high"], description: "Quest priority" },
                      xp: { type: "number", description: "XP reward (10-100)" },
                      description: { type: "string", description: "Brief quest description" }
                    },
                    required: ["name", "category", "priority", "xp"],
                    additionalProperties: false
                  }
                }
              },
              required: ["suggestions"],
              additionalProperties: false
            }
          }
        }
      ];
      requestBody.tool_choice = { type: "function", function: { name: "suggest_quests" } };
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits depleted.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to get coach response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return streaming response
    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
    });

  } catch (error) {
    console.error('Error in ai-coach-chat:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
