import { Card } from "@/components/ui/card";
import { Player } from "@/hooks/useGameState";

interface JourneyMapProps {
  player: Player;
}

const JOURNEY_CHAPTERS = [
  { id: 1, name: "The Awakening", required: 0 },
  { id: 2, name: "First Steps", required: 5 },
  { id: 3, name: "Growing Power", required: 10 },
  { id: 4, name: "The Challenge", required: 20 },
  { id: 5, name: "Rising Hero", required: 35 },
  { id: 6, name: "Master's Path", required: 50 },
  { id: 7, name: "Legend Forged", required: 75 },
  { id: 8, name: "Champion", required: 100 },
];

export const JourneyMap = ({ player }: JourneyMapProps) => {
  const questsCompleted = player.stats.questsCompleted;

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">The Hero's Journey</h2>
      
      <div className="relative">
        <svg
          viewBox="0 0 300 400"
          className="w-full h-auto"
          style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))' }}
        >
          {/* Winding Path */}
          <path
            d="M 150 20 Q 100 60 120 100 T 180 180 T 120 260 T 150 340"
            stroke="hsl(var(--border))"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.5"
          />
          
          {/* Completed Path */}
          <path
            d="M 150 20 Q 100 60 120 100 T 180 180 T 120 260 T 150 340"
            stroke="hsl(var(--secondary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: Math.max(0, 1000 - (questsCompleted / 100) * 1000),
              transition: 'stroke-dashoffset 1s ease-out'
            }}
          />

          {/* Journey Nodes */}
          {JOURNEY_CHAPTERS.map((chapter, index) => {
            const yPos = 20 + (index * 45);
            const xPos = index % 2 === 0 ? 150 : index % 3 === 0 ? 180 : 120;
            const isCompleted = questsCompleted >= chapter.required;
            const isActive = questsCompleted < chapter.required && 
                           (index === 0 || questsCompleted >= JOURNEY_CHAPTERS[index - 1].required);
            
            return (
              <g key={chapter.id}>
                <circle
                  cx={xPos}
                  cy={yPos}
                  r="15"
                  fill={isCompleted ? 'hsl(var(--secondary))' : isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                  stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth="2"
                  className={isActive ? 'pulse-glow' : ''}
                />
                <text
                  x={xPos}
                  y={yPos + 5}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {chapter.id}
                </text>
                
                {/* Chapter Name */}
                <text
                  x={xPos + (index % 2 === 0 ? 25 : -25)}
                  y={yPos + 5}
                  textAnchor={index % 2 === 0 ? 'start' : 'end'}
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  opacity="0.8"
                >
                  {chapter.name}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Progress: {questsCompleted} / 100 quests</p>
        </div>
      </div>
    </Card>
  );
};
