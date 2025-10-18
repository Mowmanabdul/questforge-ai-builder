import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Daily Wisdom Skeleton */}
      <Card className="glass-card p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-20 w-full mb-2" />
        <Skeleton className="h-4 w-24" />
      </Card>

      {/* Stats Skeleton */}
      <Card className="glass-card p-6">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-4 rounded-lg">
              <Skeleton className="h-6 w-6 mx-auto mb-2" />
              <Skeleton className="h-8 w-16 mx-auto mb-1" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
