// Deno edge runtime

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playerData, questData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct analysis prompt
    const systemPrompt = `You are an elite performance coach analyzing a user's weekly productivity through their quest completion data. Provide actionable insights in a motivating, conversational tone. Keep it concise (2-3 short paragraphs max).`;

    const userPrompt = `Analyze this week's performance:

Player Stats:
- Level ${playerData.level} (${playerData.xp} XP)
- Gold: ${playerData.gold}
- Current Streak: ${playerData.streak} days
- Total Quests Completed: ${playerData.completedQuests}

Quest History (last 7 days):
${questData.recentQuests.map((q: any) => 
  `- ${q.title} (${q.category}, ${q.xp} XP, ${q.gold} gold) - ${new Date(q.completedAt).toLocaleDateString()}`
).join('\n')}

Quest Categories Distribution:
${Object.entries(questData.categoryBreakdown).map(([cat, count]) => 
  `- ${cat}: ${count} quests`
).join('\n')}

Provide:
1. A celebration of wins this week
2. One specific pattern observation (positive or area for improvement)
3. One actionable suggestion for next week

Keep it under 150 words, friendly and motivating.`;

    console.log('Calling AI with player data...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
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
          JSON.stringify({ error: 'AI service credits depleted. Please add credits in Settings.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate insights' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices[0]?.message?.content || 'No insights generated.';

    console.log('Generated insights successfully');

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-weekly-insights:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
