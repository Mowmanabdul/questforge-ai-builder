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
    <Card className="glass-card p-4 mb-6 border-primary glow-primary animate-fade-in">
      <div className="flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-primary flex-shrink-0 animate-pulse" />
        <div className="flex-1">
          <h3 className="font-semibold text-primary mb-1">The Oracle Speaks</h3>
          <p className="text-sm text-foreground">{message.text}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setVisible(false)}
          className="flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
