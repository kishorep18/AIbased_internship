import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecommendationSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
         <div className="w-full">
            <Skeleton className="h-2 w-full" />
        </div>
        <div className="flex justify-between items-center w-full">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}
