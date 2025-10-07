import { useState, useEffect } from "react";
import { DashboardStats } from "@/components/quest/DashboardStats";
import { OracleMessage } from "@/components/quest/OracleMessage";
import { QuestList } from "@/components/quest/QuestList";
import { AddQuestForm } from "@/components/quest/AddQuestForm";
import { JourneyMap } from "@/components/quest/JourneyMap";
import { Armory } from "@/components/quest/Armory";
import { useGameState } from "@/hooks/useGameState";

const Index = () => {
  const { 
    player, 
    quests, 
    dailyFocus,
    oracleMessage,
    addQuest, 
    completeQuest,
    equipItem,
    unequipItem
  } = useGameState();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-float">
            QuestLog RPG
          </h1>
          <p className="text-muted-foreground">Transform your tasks into epic quests</p>
        </header>

        {/* Oracle Message */}
        {oracleMessage && (
          <OracleMessage message={oracleMessage} />
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Player Stats & Journey */}
          <div className="space-y-6">
            <DashboardStats player={player} />
            <JourneyMap player={player} />
            <Armory 
              inventory={player.inventory} 
              onEquip={equipItem}
              onUnequip={unequipItem}
            />
          </div>

          {/* Middle Column - Quests */}
          <div className="lg:col-span-2 space-y-6">
            <AddQuestForm onAddQuest={addQuest} />
            <QuestList 
              quests={quests} 
              dailyFocus={dailyFocus}
              onCompleteQuest={completeQuest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
