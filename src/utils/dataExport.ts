import { Player, Quest } from "@/hooks/useGameState";

export const exportToJSON = (player: Player, quests: Quest[]) => {
  const data = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    player,
    quests,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `questlog-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (player: Player, quests: Quest[]) => {
  // Export quest history as CSV
  const headers = ["Name", "Category", "XP", "Gold", "Completed At"];
  const rows = player.questHistory.map((q) => [
    q.name,
    q.category,
    q.xp.toString(),
    q.gold.toString(),
    new Date(q.completedAt).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `questlog-history-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
