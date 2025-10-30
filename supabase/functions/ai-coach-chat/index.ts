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

    // Build enhanced system prompt with context awareness
    let systemPrompt = `You are Sage, an elite AI productivity coach in a gamified quest system. You combine RPG wisdom with proven productivity science.

🎮 PLAYER PROFILE 🎮
- Level ${playerContext.level} | ${playerContext.xp} XP | ${playerContext.gold} 🪙 Gold
- ${playerContext.streak || 0}-day streak 🔥 | ${playerContext.completedQuests || 0} quests completed ✓
${playerContext.topSkills ? `- Strongest Skills: ${playerContext.topSkills}` : ''}

CORE PHILOSOPHY:
You're their strategic advisor, not just a cheerleader. Think: "What would a master tactician + productivity expert recommend?"

COMMUNICATION STYLE:
- **Direct & Strategic**: Cut to the chase with actionable advice
- **Gaming Context**: Use RPG metaphors naturally (quests, XP, boss battles)
- **Data-Driven**: Reference their stats to personalize advice
- **Realistic**: Acknowledge constraints, suggest practical steps
- **Motivational**: Celebrate wins, reframe setbacks as learning

RESPONSE STRUCTURE:
1. **Acknowledge**: Show you understand their situation
2. **Analyze**: Use their data (level, streak, skills) to provide context
3. **Recommend**: Give 1-3 concrete, prioritized actions
4. **Energize**: End with brief motivation (not over-the-top)

Keep responses under 150 words unless breaking down complex quests.`;

    if (requestType === 'breakdown') {
      systemPrompt += `\n\n⚔️ SMART BREAKDOWN MODE:
Break this quest into 3-5 sequential subtasks using the SMART framework:
- **Specific**: Each subtask is crystal clear
- **Measurable**: You'll know when it's done
- **Achievable**: Doable in one focused session
- **Relevant**: Directly advances the main quest
- **Time-boxed**: Can be completed in 30-60 minutes

Think: "If I were coaching someone through this, what are the logical steps?"

Quest Details:
- Name: ${breakdownQuest.name}
- Category: ${breakdownQuest.category}
- Priority: ${breakdownQuest.priority}
${breakdownQuest.description ? `- Context: ${breakdownQuest.description}` : ''}

Return subtasks that flow naturally from start to finish.`;
    } else if (requestType === 'smart_reminder') {
      systemPrompt += `\n\n🎯 PRIORITY ADVISOR MODE:
Analyze their quest log using the Eisenhower Matrix:
1. **Urgent + Important**: Do first (high priority + soon due)
2. **Important, Not Urgent**: Schedule (high priority + no deadline)
3. **Urgent, Not Important**: Delegate/quick wins (due soon but low priority)
4. **Neither**: Defer (low priority + no deadline)

Current Active Quests:
${activeQuests?.map((q: any) => `- ${q.name} | ${q.category} | ${q.priority} priority${q.dueDate ? ` | Due: ${new Date(q.dueDate).toLocaleDateString()}` : ''} | ${q.xp} XP`).join('\n') || 'No active quests'}

Give ONE specific recommendation: "Start with [quest name] because [strategic reason]." Be tactical, not generic.`;
    } else if (requestType === 'suggest') {
      systemPrompt += `\n\n✨ INTELLIGENT QUEST GENERATION:
Analyze their profile to suggest 3-5 quests that:
1. **Build on strengths**: Leverage their top skills (${playerContext.topSkills || 'various categories'})
2. **Fill gaps**: Diversify their quest portfolio
3. **Match level**: Appropriate difficulty for Level ${playerContext.level}
4. **Create momentum**: Mix quick wins with meaningful challenges

Current Quest Portfolio:
${activeQuests?.map((q: any) => `- ${q.name} (${q.category}, ${q.priority}, ${q.xp} XP)`).join('\n') || 'Starting fresh!'}

Suggest specific, actionable quests with clear outcomes. Avoid generic tasks.`;
    } else if (requestType === 'review') {
      systemPrompt += `\n\n📋 STRATEGIC PORTFOLIO REVIEW:
Analyze their quest log across 4 dimensions:
1. **Workload**: Total quest count vs. optimal (5-7 active)
2. **Balance**: Category distribution (avoid single-category tunneling)
3. **Priority Mix**: High/med/low distribution (need 60% high-priority)
4. **Timeline**: Deadline pressure analysis

Active Quest Log:
${activeQuests?.map((q: any) => `- ${q.name} | ${q.category} | ${q.priority} | ${q.xp} XP`).join('\n') || 'Quest log is empty'}

Provide 2-3 tactical recommendations with specific actions. Example: "Pause [quest] until you complete [quest] to avoid context switching."`;
    } else if (questContext) {
      systemPrompt += `\n\n🎯 QUEST MASTERY COACHING:
Deep-dive coaching for this specific quest. Provide:
1. **Strategic approach**: Best way to tackle it
2. **Common pitfalls**: What to avoid
3. **Success metric**: How to know you've truly completed it
4. **Next steps**: First concrete action

Quest Details:
- ${questContext.name}
- Category: ${questContext.category} | Priority: ${questContext.priority} | Worth: ${questContext.xp} XP
${questContext.description ? `- Context: ${questContext.description}` : ''}

Be specific and tactical.`;
    } else {
      systemPrompt += `\n\n💬 GENERAL COACHING MODE:
You're in open conversation. The hero needs guidance. Focus on:

**When they share wins**: Celebrate specifically (reference XP, streak, level)
**When they're stuck**: Break down barriers with tactical questions
**When they need direction**: Reference their stats to guide them
**When they're overwhelmed**: Prioritize ruthlessly

Key Principles:
- Ask clarifying questions when needed
- Reference their actual data (Level ${playerContext.level}, ${playerContext.completedQuests || 0} quests done)
- Suggest actionable next steps
- Keep it conversational but purposeful

You're a coach who helps them level up, not just a chatbot.`;
    }

    console.log('Calling AI coach with context:', { playerContext, requestType, breakdownQuest: !!breakdownQuest });

    const requestBody: any = {
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 600,
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
