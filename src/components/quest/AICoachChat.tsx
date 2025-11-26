import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, Loader2, Lightbulb, ListChecks, Plus, RotateCcw } from "lucide-react";
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
  onSettingsClick?: () => void;
}

export const AICoachChat = ({ player, activeQuests, questContext, onAddQuest, onClearContext, onUpdateQuest, onSettingsClick }: AICoachChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('ai_coach_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.slice(-20)); // Keep last 20 messages for context
      } catch (e) {
        console.error('Failed to load conversation history:', e);
      }
    }
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('ai_coach_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Populate initial context if questContext is provided
  useEffect(() => {
    if (questContext) {
      const contextMessage = {
        role: 'assistant' as const,
        content: `⚔️ Greetings, Champion! I see you've selected the quest: **"${questContext.name}"**\n\n` +
                 `Category: ${questContext.category} | Priority: ${questContext.priority} | XP: ${questContext.xp}\n\n` +
                 `How shall we conquer this quest? I can:\n` +
                 `• Break it into strategic subtasks\n` +
                 `• Suggest approaches based on your current level (${player.level})\n` +
                 `• Provide tactical advice for maximum efficiency\n\n` +
                 `What's your move, Adventurer?`
      };
      setMessages(prev => [...prev.slice(-19), contextMessage]); // Keep history but add context
    }
  }, [questContext]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const streamChat = async (userMessage: string, requestType?: string, breakdownQuest?: Quest) => {
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Enhanced player context with history awareness
      const recentCompletedCount = player.stats.questsCompleted || 0;
      const topCategories = Object.entries(player.skills)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 3)
        .map(([cat, level]) => `${cat} (Level ${level})`);

      const playerContext = {
        level: player.level,
        xp: player.xp,
        gold: player.gold,
        streak: player.streak,
        completedQuests: recentCompletedCount,
        topSkills: topCategories.join(', '),
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

  const handleResetConversation = () => {
    setMessages([]);
    localStorage.removeItem('ai_coach_history');
    toast({
      title: "Conversation Reset",
      description: "Your chat history has been cleared.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Conditional Quest Context Bar */}
      {questContext && onClearContext && (
        <Card className="glass-card border-primary/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Discussing: {questContext.name}</p>
              <p className="text-xs text-muted-foreground">{questContext.category} • {questContext.xp} XP</p>
            </div>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onClearContext}
            className="hover:bg-primary/10"
          >
            Clear Context
          </Button>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="glass-card border-primary/40 glow-primary h-[calc(100vh-12rem)] md:h-[650px] flex flex-col overflow-hidden">
        <CardHeader className="border-b border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 py-3 px-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI Coach</span>
          </div>
          {messages.length > 0 && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleResetConversation}
              className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
              title="Reset conversation"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0 p-3 md:p-6">
        <ScrollArea className="flex-1 pr-2 md:pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && !questContext && (
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30 animate-pulse">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                <p className="text-xl font-bold text-foreground">
                  👋 Hey there, Champion!
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  I'm your AI productivity coach. I can help you create quests, prioritize tasks, and stay motivated.
                </p>
                <div className="text-xs text-muted-foreground/70 max-w-md mx-auto pt-2">
                  Level {player.level} • {player.stats.questsCompleted || 0} completed • {player.streak || 0} day streak
                </div>
                </div>
                <div className="flex flex-col gap-3 max-w-md mx-auto">
                  <Button
                    onClick={() => handleSpecialRequest('suggest')}
                    variant="outline"
                    className="w-full glass-card border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 h-auto py-4"
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-3">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">Suggest New Quests</div>
                        <div className="text-xs text-muted-foreground">Get personalized quest ideas based on your goals</div>
                      </div>
                    </div>
                  </Button>
                  {activeQuests.length > 0 && (
                    <>
                      <Button
                        onClick={() => handleSpecialRequest('review')}
                        variant="outline"
                        className="w-full glass-card border-accent/30 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 h-auto py-4"
                        disabled={isLoading}
                      >
                        <div className="flex items-center gap-3">
                          <ListChecks className="w-5 h-5 text-accent" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Prioritize Current Quests</div>
                            <div className="text-xs text-muted-foreground">Review and organize your active tasks</div>
                          </div>
                        </div>
                      </Button>
                      <Button
                        onClick={() => handleSpecialRequest('smart_reminder')}
                        variant="outline"
                        className="w-full glass-card border-gold/30 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 h-auto py-4"
                        disabled={isLoading}
                      >
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-gold" />
                          <div className="text-left">
                            <div className="font-semibold text-sm">Quick Recommendation</div>
                            <div className="text-xs text-muted-foreground">What should I focus on right now?</div>
                          </div>
                        </div>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-fade-in">
                <div
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 md:p-4 shadow-md transition-all duration-300 hover:shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                        : 'bg-gradient-to-br from-muted to-muted/80 border border-border/50'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-sm prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-ul:space-y-2 prose-p:leading-relaxed prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0">
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-3 text-primary" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 text-primary" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-sm font-semibold mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="space-y-2 mb-3 ml-4" {...props} />,
                            ol: ({node, ...props}) => <ol className="space-y-2 mb-3 ml-4" {...props} />,
                            li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-primary" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            code: ({node, inline, ...props}: any) => 
                              inline ? (
                                <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props} />
                              ) : (
                                <code className="block bg-muted p-3 rounded text-sm my-2" {...props} />
                              ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
                {msg.subtaskSuggestions && msg.subtaskSuggestions.length > 0 && questContext && onUpdateQuest && (
                  <div className="mt-3 animate-fade-in">
                    <Card className="glass-card p-4 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-accent" />
                        Suggested Subtasks:
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {msg.subtaskSuggestions.map((subtask, sIdx) => (
                          <li key={sIdx} className="text-sm flex items-center gap-3 p-2 rounded-lg bg-background/50">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="flex-1">{subtask.name}</span>
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
                        className="w-full bg-accent hover:bg-accent/90"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add All Subtasks to Quest
                      </Button>
                    </Card>
                  </div>
                )}
                {msg.questSuggestions && msg.questSuggestions.length > 0 && (
                  <div className="mt-3 space-y-3 animate-fade-in">
                    {msg.questSuggestions.map((suggestion, sIdx) => (
                      <Card key={sIdx} className="glass-card p-4 border-primary/30 hover:border-primary/50 hover:glow-primary transition-all duration-300">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base mb-2">{suggestion.name}</h4>
                            {suggestion.description && (
                              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{suggestion.description}</p>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs border-primary/30 bg-primary/5">
                                📂 {suggestion.category}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  suggestion.priority === 'high' 
                                    ? 'border-red-500/30 bg-red-500/5 text-red-500' 
                                    : suggestion.priority === 'medium'
                                    ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500'
                                    : 'border-green-500/30 bg-green-500/5 text-green-500'
                                }`}
                              >
                                🎯 {suggestion.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-accent/30 bg-accent/5">
                                ⭐ {suggestion.xp} XP
                              </Badge>
                            </div>
                          </div>
                          {onAddQuest && (
                            <Button
                              size="sm"
                              onClick={() => handleAddSuggestion(suggestion)}
                              className="flex-shrink-0 bg-primary hover:bg-primary/90"
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
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-3 items-end pt-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your coach anything... (Press Enter to send)"
              className="min-h-[60px] resize-none pr-12 glass-card border-primary/30 focus:border-primary/50 focus:glow-primary transition-all duration-300"
              disabled={isLoading}
            />
            {input.trim() && (
              <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                ↵ Send
              </span>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px] flex-shrink-0 bg-primary hover:bg-primary/90 glow-primary transition-all duration-300"
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
    </div>
  );
};
