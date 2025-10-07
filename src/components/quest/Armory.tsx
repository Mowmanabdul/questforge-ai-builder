import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles, Gem, Crown, Plus, Minus } from "lucide-react";
import { LootItem } from "@/hooks/useGameState";

interface ArmoryProps {
  inventory: {
    equipped: LootItem[];
    stored: LootItem[];
  };
  onEquip: (item: LootItem) => void;
  onUnequip: (item: LootItem) => void;
}

const ICON_MAP = {
  shield: Shield,
  sparkles: Sparkles,
  gem: Gem,
  crown: Crown,
};

const RARITY_COLORS = {
  common: 'text-[hsl(var(--loot-common))] border-[hsl(var(--loot-common))]',
  rare: 'text-[hsl(var(--loot-rare))] border-[hsl(var(--loot-rare))]',
  epic: 'text-[hsl(var(--loot-epic))] border-[hsl(var(--loot-epic))]',
  legendary: 'text-[hsl(var(--loot-legendary))] border-[hsl(var(--loot-legendary))]',
};

export const Armory = ({ inventory, onEquip, onUnequip }: ArmoryProps) => {
  const hasItems = inventory.equipped.length > 0 || inventory.stored.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Armory</h2>

      {/* Equipped Items */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          Equipped ({inventory.equipped.length}/3)
        </h3>
        <div className="space-y-2">
          {inventory.equipped.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No items equipped</p>
          ) : (
            inventory.equipped.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Shield;
              return (
                <div
                  key={item.id}
                  className={`glass-card p-3 rounded-lg border ${RARITY_COLORS[item.rarity]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <Icon className={`w-5 h-5 mt-0.5 ${RARITY_COLORS[item.rarity]}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.type === 'xp_boost' && `+${item.value * 100}% XP`}
                          {item.type === 'gold_boost' && `+${item.value * 100}% Gold`}
                          {item.category && ` (${item.category})`}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.rarity}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUnequip(item)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Stored Items */}
      {inventory.stored.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Storage</h3>
          <div className="space-y-2">
            {inventory.stored.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] || Shield;
              return (
                <div
                  key={item.id}
                  className={`glass-card p-3 rounded-lg border ${RARITY_COLORS[item.rarity]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <Icon className={`w-5 h-5 mt-0.5 ${RARITY_COLORS[item.rarity]}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {item.type === 'xp_boost' && `+${item.value * 100}% XP`}
                          {item.type === 'gold_boost' && `+${item.value * 100}% Gold`}
                          {item.category && ` (${item.category})`}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.rarity}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEquip(item)}
                      disabled={inventory.equipped.length >= 3}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};
