import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const WISDOM_QUOTES = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Every accomplishment starts with the decision to try.", author: "Unknown" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Your only limit is you.", author: "Unknown" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
  { text: "Success doesn't come from what you do occasionally, it comes from what you do consistently.", author: "Marie Forleo" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Excellence is not a destination; it is a continuous journey that never ends.", author: "Brian Tracy" },
];

export const DailyWisdom = () => {
  const [quote, setQuote] = useState(WISDOM_QUOTES[0]);

  useEffect(() => {
    // Get quote based on the day
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(WISDOM_QUOTES[dayOfYear % WISDOM_QUOTES.length]);
  }, []);

  return (
    <Card className="glass-card border-insight/30 bg-gradient-to-br from-insight/5 to-primary/5 animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-full bg-insight/10">
              <Sparkles className="w-6 h-6 text-insight" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium italic mb-2 leading-relaxed">
              "{quote.text}"
            </p>
            <p className="text-xs text-muted-foreground">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
