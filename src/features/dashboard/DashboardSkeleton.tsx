import { Skeleton } from "@/components/ui/skeleton";
import { PaperPanel } from "@/components/common/PaperPanel";

/** Loading state for the dashboard. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-56 w-full rounded-lg" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <PaperPanel key={i}>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-4 h-36 w-full" />
          </PaperPanel>
        ))}
      </div>
      <PaperPanel>
        <Skeleton className="h-5 w-48" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </PaperPanel>
    </div>
  );
}
