import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const QuestListSkeleton = () => {
  return (
    <Card className="glass-card p-6">
      <div className="mb-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
