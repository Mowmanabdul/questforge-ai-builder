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

    // Build system prompt based on request type
    let systemPrompt = `You are an experienced productivity coach and motivational mentor in a gamified quest system. 

Player Context:
- Level ${playerContext.level} (${playerContext.xp} XP)
- ${playerContext.gold} gold coins
- ${playerContext.streak} day streak
- Completed ${playerContext.completedQuests} quests total`;

    if (requestType === 'breakdown') {
      systemPrompt += `\n\nQuest to Break Down:\n- Name: ${breakdownQuest.name}\n- Category: ${breakdownQuest.category}\n- Priority: ${breakdownQuest.priority}${breakdownQuest.description ? `\n- Description: ${breakdownQuest.description}` : ''}

Your task: Break this quest down into 3-5 clear, actionable subtasks. Each subtask should be specific and achievable.`;
    } else if (requestType === 'smart_reminder') {
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority} priority${q.dueDate ? `, due ${new Date(q.dueDate).toLocaleDateString()}` : ''})`).join('\n') || 'None'}

Your task: Based on current priorities, urgency, and due dates, suggest 2-3 quests the player should focus on RIGHT NOW. Explain why each is a good choice for this moment. Consider:
- Approaching due dates (urgency)
- High priority items
- Quick wins vs longer tasks
- Variety in task types

Give clear, actionable recommendations for what to work on now.`;
    } else if (requestType === 'suggest') {
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority} priority, ${q.xp} XP)`).join('\n') || 'None'}

Your task: Analyze the player's profile and active quests to suggest 3-5 NEW actionable quests they should add. Consider:
- Balance across categories
- Appropriate difficulty for their level
- Gaps in their current quests
- Building on their momentum (${playerContext.streak} day streak!)

Be specific and practical with quest suggestions.`;
    } else if (requestType === 'review') {
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority} priority, ${q.xp} XP)`).join('\n') || 'None'}

Your task: Review their active quests and provide prioritization advice. Consider:
- Which quests align with maintaining their ${playerContext.streak} day streak
- Which high-priority items need immediate attention
- Suggest a good order to tackle them today
- Identify if any quests might be overwhelming and need breaking down

Give clear, actionable prioritization guidance.`;
    } else if (questContext) {
      systemPrompt += `\n\nSpecific Quest Context:\n- Name: ${questContext.name}\n- Category: ${questContext.category}\n- Priority: ${questContext.priority}\n- XP Value: ${questContext.xp}${questContext.description ? `\n- Description: ${questContext.description}` : ''}

Your task: Provide personalized coaching specifically for THIS quest. Offer:
- Strategies to complete it effectively
- Tips for staying motivated
- Ways to break it down if needed
- How it fits into their overall progress

Focus your entire response on helping them succeed with this specific quest.`;
    } else {
      systemPrompt += `\n\nYour role:
- Provide personalized motivation and productivity advice
- Help break down overwhelming tasks into manageable quests
- Celebrate wins and encourage during setbacks
- Suggest strategies for maintaining streaks and building habits
- Keep responses concise (2-3 paragraphs max) and actionable
- Use a warm, encouraging tone with occasional gaming metaphors
- Focus on sustainable progress over perfection

Remember: Every hero's journey has ups and downs. Your job is to be their trusted guide.`;
    }

    console.log('Calling AI coach with context:', { playerContext, requestType, breakdownQuest: !!breakdownQuest });

    const requestBody: any = {
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: 500,
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
