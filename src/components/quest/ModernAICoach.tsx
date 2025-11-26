import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  User, 
  Send, 
  Target, 
  Wand2,
  RefreshCw,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernAICoachProps {
  player: any;
  activeQuests: any[];
  questContext?: any;
  onAddQuest: (quest: any) => void;
  onClearContext: () => void;
  onUpdateQuest?: (questId: string, updates: any) => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const ModernAICoach = ({
  player,
  activeQuests,
  questContext,
  onAddQuest,
  onClearContext,
  onUpdateQuest
}: ModernAICoachProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello ${player.name || 'Hero'}! 🎯 I'm your AI Quest Coach. I can help you:\n\n• Break down complex goals into manageable quests\n• Optimize your quest priorities\n• Suggest improvements to existing quests\n• Provide motivation and productivity tips\n\nWhat would you like to work on today?`,
      timestamp: new Date(),
      suggestions: [
        "Help me prioritize my quests",
        "Break down a big goal into smaller tasks",
        "Give me motivation tips",
        "Analyze my progress"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response (replace with actual AI call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage, player, activeQuests),
        timestamp: new Date(),
        suggestions: generateSuggestions()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const generateAIResponse = (message: string, player: any, quests: any[]) => {
    // This would be replaced with actual AI integration
    const responses = [
      `Based on your current level (${player.level}) and ${quests.length} active quests, I recommend focusing on high-priority tasks first. Would you like me to help you reorganize them?`,
      `Great question! Looking at your XP progress (${player.xp}), you're doing well. Here's what I suggest to optimize your productivity...`,
      `I see you have quests in different categories. Let's create a balanced approach that aligns with your goals.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateSuggestions = () => {
    const suggestions = [
      "Create a morning routine quest",
      "Set up weekly review sessions", 
      "Add a learning goal",
      "Plan a reward milestone",
      "Schedule break times"
    ];
    return suggestions.slice(0, 3);
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 mb-4",
        message.type === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {message.type === 'ai' && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
        message.type === 'user' 
          ? "bg-primary text-primary-foreground ml-12" 
          : "bg-muted text-foreground mr-12"
      )}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        
        {message.suggestions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-auto p-2 text-xs bg-background/50 hover:bg-background/80"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
        
        <div className="text-xs opacity-60 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Compact Context Bar - Only show if there's context */}
      {questContext && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 rounded-xl glass-card border-border/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Discussing Quest</p>
              <p className="text-sm font-semibold">{questContext.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearContext}
            className="h-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Chat Interface */}
      <div className="bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-sm rounded-2xl border border-border/30 shadow-2xl overflow-hidden">
        {/* Minimal Chat Header */}
        <div className="px-4 py-3 border-b border-border/30 bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">AI Coach</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Ready
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessages([messages[0]])}
              className="h-8 text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-96 p-6" ref={scrollRef}>
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-3">
            <Textarea
              placeholder="Ask me anything about your quests, productivity, or goals..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="resize-none bg-background"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => handleSuggestionClick("Help me prioritize today's tasks")}>
              <Wand2 className="w-3 h-3 mr-1" />
              Prioritize Tasks
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => handleSuggestionClick("Create a new productive habit")}>
              <Target className="w-3 h-3 mr-1" />
              New Habit
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => handleSuggestionClick("Analyze my quest completion patterns")}>
              <Bot className="w-3 h-3 mr-1" />
              Analyze Progress
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
