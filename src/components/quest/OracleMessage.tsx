import { Card } from "@/components/ui/card";
import { Sparkles, X } from "lucide-react";
import { OracleMessage as OracleMessageType } from "@/hooks/useGameState";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface OracleMessageProps {
  message: OracleMessageType;
}

export const OracleMessage = ({ message }: OracleMessageProps) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Card className="glass-card p-4 mb-6 border-primary/40 glow-primary animate-fade-in hover:border-primary/60 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-primary mb-1.5 text-base">✨ The Oracle Speaks</h3>
          <p className="text-sm text-foreground leading-relaxed">{message.text}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setVisible(false)}
          className="flex-shrink-0 hover:bg-primary/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
