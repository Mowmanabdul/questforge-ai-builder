import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Quest } from "@/hooks/useGameState";
import { format, isSameDay } from "date-fns";
import { CalendarDays, Circle } from "lucide-react";

interface CalendarViewProps {
  quests: Quest[];
  onQuestClick?: (quest: Quest) => void;
}

export const CalendarView = ({ quests, onQuestClick }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Only show quests with due dates
  const questsWithDates = quests.filter(q => !q.completed && q.dueDate);
  
  const questsForSelectedDate = selectedDate
    ? questsWithDates.filter(q => q.dueDate && isSameDay(new Date(q.dueDate), selectedDate))
    : [];

  const datesWithQuests = questsWithDates
    .map(q => q.dueDate)
    .filter((date): date is Date => date !== undefined);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Quest Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border w-full"
            modifiers={{
              hasQuest: datesWithQuests
            }}
            modifiersClassNames={{
              hasQuest: "bg-primary/20 font-bold"
            }}
          />
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questsForSelectedDate.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No quests scheduled for this day
            </p>
          ) : (
            <div className="space-y-3">
              {questsForSelectedDate.map(quest => (
                <div
                  key={quest.id}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => onQuestClick?.(quest)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Circle className={`w-3 h-3 fill-current ${getPriorityColor(quest.priority)}`} />
                        <h4 className="font-semibold text-sm">{quest.name}</h4>
                      </div>
                      {quest.description && (
                        <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">{quest.category}</Badge>
                        {quest.priority && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {quest.priority}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">{quest.xp} XP</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
