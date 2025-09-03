import { Briefcase, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Recommendation = {
  title: string;
  company: string;
  description: string;
  location: string;
  relevanceScore: number;
};

type RecommendationCardProps = {
  recommendation: Recommendation;
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const relevancePercentage = Math.round(recommendation.relevanceScore * 100);

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-xl transition-shadow duration-300 bg-card/80">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{recommendation.title}</CardTitle>
        <CardDescription className="flex items-center pt-1">
          <Briefcase className="h-4 w-4 mr-2" />
          {recommendation.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">
          {recommendation.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-primary">Relevance</span>
                <span className="text-xs font-bold text-primary">{relevancePercentage}%</span>
            </div>
            <Progress value={relevancePercentage} aria-label={`${relevancePercentage}% relevant`} className="h-2" />
        </div>
        <div className="flex justify-between items-center w-full">
          <Badge variant="secondary" className="flex items-center">
            <MapPin className="h-3 w-3 mr-1.5" />
            {recommendation.location}
          </Badge>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Apply Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
