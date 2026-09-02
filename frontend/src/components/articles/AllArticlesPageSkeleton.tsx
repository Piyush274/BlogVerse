import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllArticlesPageSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden transition-all hover:shadow-lg border bg-card/50"
        >
          <div className="p-6">
            <Skeleton className="mb-4 h-48 w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="mt-2 h-4 w-1/2 rounded-lg" />
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-24 rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
