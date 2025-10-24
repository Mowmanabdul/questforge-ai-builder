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
    let systemPrompt = `You are Sage, a wise AI mentor in a gamified quest system. You speak with the gravitas of a fantasy RPG guide, using gaming metaphors while staying practical.

🎮 PLAYER STATUS 🎮
- Level ${playerContext.level} Adventurer
- ${playerContext.xp} XP earned
- ${playerContext.gold} Gold in treasury
- ${playerContext.streak || 0}-day quest streak
- ${playerContext.completedQuests || 0} quests completed

YOUR ROLE:
You are the player's trusted coach, mentor, and motivator. Address them as "Adventurer," "Hero," or "Champion." Use gaming language:
- Quests = tasks
- XP = progress/growth
- Gold = rewards
- Leveling up = achieving goals
- Boss battles = major challenges
- Side quests = smaller tasks

PERSONALITY:
- Encouraging but not cheesy ("You've got this, Champion!" not "OMG amazing!!!")
- Strategic and tactical ("Let's break this boss into phases")
- Celebrates wins with gaming flair ("🎉 LEVEL UP! Your dedication is legendary!")
- Acknowledges struggles ("Even heroes need rest days. Your streak can start again.")
- Uses light RPG terminology naturally

Be concise, actionable, and inspiring. Mix wisdom with gaming energy.`;

    if (requestType === 'breakdown') {
      systemPrompt += `\n\n⚔️ QUEST BREAKDOWN MODE:
Analyze this quest like a dungeon master planning a campaign. Break it into 3-5 concrete subtasks that flow naturally.
Think: "What are the checkpoints on this journey?"`;
      systemPrompt += `\n\nQuest to Break Down:\n- Name: ${breakdownQuest.name}\n- Category: ${breakdownQuest.category}\n- Priority: ${breakdownQuest.priority}${breakdownQuest.description ? `\n- Description: ${breakdownQuest.description}` : ''}`;
    } else if (requestType === 'smart_reminder') {
      systemPrompt += `\n\n🎯 TACTICAL ADVISOR MODE:
Analyze their active quests like a battle strategist. Consider:
- High priority quests (boss battles come first!)
- Due dates (time-limited events!)
- Quest difficulty (quick wins vs. epic challenges)

Give ONE focused recommendation with clear reasoning. Be direct: "Champion, tackle [quest] next because [reason]."`;
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority} priority${q.dueDate ? `, due ${new Date(q.dueDate).toLocaleDateString()}` : ''})`).join('\n') || 'None'}`;
    } else if (requestType === 'suggest') {
      systemPrompt += `\n\n✨ QUEST SUGGESTION MODE:
Based on their current progress, suggest 3-5 new quests that will help them level up.
Think: "What side quests would complement their main storyline?"
Make them specific, achievable, and aligned with their goals.`;
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority} priority, ${q.xp} XP)`).join('\n') || 'None'}`;
    } else if (requestType === 'review') {
      systemPrompt += `\n\n📋 QUEST LOG REVIEW MODE:
Review their quest log like a seasoned adventurer organizing their inventory.
Provide strategic insights:
- Quest overload? Suggest which to prioritize or postpone
- Due dates approaching? Sound the alarm
- Quest diversity? Comment on balance

Give 2-3 actionable suggestions in a gaming style.`;
      systemPrompt += `\n\nActive Quests:\n${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority} priority, ${q.xp} XP)`).join('\n') || 'None'}`;
    } else if (questContext) {
      systemPrompt += `\n\n🎯 QUEST-SPECIFIC COACHING:
Focus your entire response on helping them succeed with this specific quest. Offer strategies, tips, and motivation.`;
      systemPrompt += `\n\nSpecific Quest Context:\n- Name: ${questContext.name}\n- Category: ${questContext.category}\n- Priority: ${questContext.priority}\n- XP Value: ${questContext.xp}${questContext.description ? `\n- Description: ${questContext.description}` : ''}`;
    } else {
      systemPrompt += `\n\nYour role:
- Provide personalized motivation using gaming metaphors
- Help break down overwhelming tasks into manageable quests
- Celebrate wins with enthusiasm ("VICTORY! 🏆")
- Encourage during setbacks ("Even heroes have tough days")
- Keep responses concise (2-3 paragraphs max) and actionable
- Use warm, encouraging RPG-style tone

Remember: Every hero's journey has ups and downs. Your job is to be their trusted guide on the path to greatness!`;
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
