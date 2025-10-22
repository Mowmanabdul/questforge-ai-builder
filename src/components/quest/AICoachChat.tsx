import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, Loader2, Lightbulb, ListChecks, Plus } from "lucide-react";
import { Player, Quest } from "@/hooks/useGameState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  questSuggestions?: QuestSuggestion[];
  subtaskSuggestions?: SubtaskSuggestion[];
}

interface QuestSuggestion {
  name: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  xp: number;
  description?: string;
}

interface SubtaskSuggestion {
  name: string;
}

interface AICoachChatProps {
  player: Player;
  activeQuests: Quest[];
  questContext?: Quest;
  onAddQuest?: (quest: Omit<Quest, 'id' | 'completed' | 'completedAt' | 'createdAt'>) => void;
  onClearContext?: () => void;
  onUpdateQuest?: (questId: string, updates: Partial<Quest>) => void;
}

export const AICoachChat = ({ player, activeQuests, questContext, onAddQuest, onClearContext, onUpdateQuest }: AICoachChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-populate message when quest context is provided
  useEffect(() => {
    if (questContext && messages.length === 0) {
      handleSpecialRequest('quest-specific', 
        `Help me with this quest: "${questContext.name}" (${questContext.category}, ${questContext.priority} priority)`);
    }
  }, [questContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string, requestType?: string, breakdownQuest?: Quest) => {
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const playerContext = {
        level: player.level,
        xp: player.xp,
        gold: player.gold,
        streak: player.streak,
        completedQuests: player.stats.questsCompleted,
      };

      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach-chat`;

      const requestBody: any = {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        playerContext,
      };

      if (requestType === 'suggest') {
        requestBody.requestType = 'suggest';
        requestBody.activeQuests = activeQuests.map(q => ({
          name: q.name,
          category: q.category,
          priority: q.priority,
          xp: q.xp
        }));
      } else if (requestType === 'review') {
        requestBody.requestType = 'review';
        requestBody.activeQuests = activeQuests.map(q => ({
          name: q.name,
          category: q.category,
          priority: q.priority,
          xp: q.xp
        }));
      } else if (requestType === 'quest-specific' && questContext) {
        requestBody.questContext = {
          name: questContext.name,
          category: questContext.category,
          priority: questContext.priority,
          xp: questContext.xp,
          description: questContext.description
        };
      } else if (requestType === 'breakdown' && breakdownQuest) {
        requestBody.requestType = 'breakdown';
        requestBody.breakdownQuest = {
          name: breakdownQuest.name,
          category: breakdownQuest.category,
          priority: breakdownQuest.priority,
          xp: breakdownQuest.xp,
          description: breakdownQuest.description
        };
      } else if (requestType === 'smart_reminder') {
        requestBody.requestType = 'smart_reminder';
        requestBody.activeQuests = activeQuests.map(q => ({
          name: q.name,
          category: q.category,
          priority: q.priority,
          xp: q.xp,
          dueDate: q.dueDate
        }));
      }

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from coach');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let buffer = '';
      let questSuggestions: QuestSuggestion[] | undefined;

      // Add empty assistant message
      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            const toolCalls = parsed.choices?.[0]?.delta?.tool_calls;
            
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
            }
            
            // Handle tool calls for quest suggestions and subtask breakdown
            if (toolCalls && toolCalls[0]?.function?.arguments) {
              try {
                const args = JSON.parse(toolCalls[0].function.arguments);
                if (args.suggestions) {
                  questSuggestions = args.suggestions;
                  setMessages([...newMessages, { 
                    role: 'assistant', 
                    content: "Here are my quest suggestions for you:", 
                    questSuggestions 
                  }]);
                } else if (args.subtasks) {
                  const subtaskSuggestions = args.subtasks;
                  setMessages([...newMessages, { 
                    role: 'assistant', 
                    content: "Here's how I'd break down this quest:", 
                    subtaskSuggestions 
                  }]);
                }
              } catch (e) {
                console.error('Error parsing tool call:', e);
              }
            }
          } catch (e) {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

    } catch (error) {
      console.error('Error chatting with coach:', error);
      toast({
        title: "Error",
        description: "Failed to get response from coach. Please try again.",
        variant: "destructive",
      });
      setMessages(newMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecialRequest = async (type: 'suggest' | 'review' | 'quest-specific' | 'breakdown' | 'smart_reminder', customMessage?: string, quest?: Quest) => {
    if (isLoading) return;
    
    let userMessage = '';
    if (type === 'suggest') {
      userMessage = 'Can you suggest some new quests for me based on my current progress?';
    } else if (type === 'review') {
      userMessage = 'Can you review my active quests and help me prioritize them?';
    } else if (type === 'breakdown' && quest) {
      userMessage = `Can you break down this quest into smaller subtasks: "${quest.name}"?`;
    } else if (type === 'smart_reminder') {
      userMessage = 'What quests should I focus on right now?';
    } else if (customMessage) {
      userMessage = customMessage;
    }
    
    await streamChat(userMessage, type, quest);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await streamChat(userMessage);
  };

  const handleAddSuggestion = (suggestion: QuestSuggestion) => {
    if (onAddQuest) {
      onAddQuest({
        name: suggestion.name,
        category: suggestion.category,
        priority: suggestion.priority,
        xp: suggestion.xp,
        description: suggestion.description,
      });
      toast({
        title: "Quest Added!",
        description: `"${suggestion.name}" has been added to your active quests.`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="glass-card border-primary/30 shadow-glow h-[600px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <CardTitle className="text-xl">AI Productivity Coach</CardTitle>
          </div>
          {questContext && onClearContext && (
            <Button size="sm" variant="ghost" onClick={onClearContext}>
              Clear Context
            </Button>
          )}
        </div>
        {questContext && (
          <Badge variant="outline" className="mt-2">
            Discussing: {questContext.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && !questContext && (
              <div className="text-center py-8 text-muted-foreground space-y-4">
                <div>
                  <p className="mb-2">👋 Hello, Hero!</p>
                  <p className="text-sm">
                    I'm your AI productivity coach. Try these quick actions:
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleSpecialRequest('suggest')}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Suggest New Quests
                  </Button>
                  <Button
                    onClick={() => handleSpecialRequest('review')}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading || activeQuests.length === 0}
                  >
                    <ListChecks className="w-4 h-4 mr-2" />
                    Review & Prioritize My Quests
                  </Button>
                  <Button
                    onClick={() => handleSpecialRequest('smart_reminder')}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading || activeQuests.length === 0}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    What Should I Work On Now?
                  </Button>
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
                {msg.subtaskSuggestions && msg.subtaskSuggestions.length > 0 && questContext && onUpdateQuest && (
                  <div className="mt-3">
                    <Card className="p-3 bg-muted/50">
                      <h4 className="font-semibold text-sm mb-2">Suggested Subtasks:</h4>
                      <ul className="space-y-1 mb-3">
                        {msg.subtaskSuggestions.map((subtask, sIdx) => (
                          <li key={sIdx} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {subtask.name}
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="sm"
                        onClick={() => {
                          const subtasks = msg.subtaskSuggestions!.map((s, idx) => ({
                            id: `subtask-${Date.now()}-${idx}`,
                            name: s.name,
                            completed: false
                          }));
                          onUpdateQuest(questContext.id, { subtasks });
                          toast({
                            title: "Subtasks Added!",
                            description: `Added ${subtasks.length} subtasks to "${questContext.name}".`,
                          });
                        }}
                        className="w-full"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add All Subtasks
                      </Button>
                    </Card>
                  </div>
                )}
                {msg.questSuggestions && msg.questSuggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.questSuggestions.map((suggestion, sIdx) => (
                      <Card key={sIdx} className="p-3 bg-muted/50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{suggestion.name}</h4>
                            {suggestion.description && (
                              <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{suggestion.category}</Badge>
                              <Badge variant="outline" className="text-xs">{suggestion.priority}</Badge>
                              <Badge variant="outline" className="text-xs">{suggestion.xp} XP</Badge>
                            </div>
                          </div>
                          {onAddQuest && (
                            <Button
                              size="sm"
                              onClick={() => handleAddSuggestion(suggestion)}
                              className="flex-shrink-0"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'assistant' && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Coach is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your coach anything..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px] flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
