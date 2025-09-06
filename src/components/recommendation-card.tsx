import { useState } from "react";
import { Briefcase, MapPin, Route, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getRoadmap } from "@/app/actions";
import type { GenerateRoadmapOutput } from "@/ai/flows/generate-roadmap";
import { useToast } from "@/hooks/use-toast";

type Recommendation = {
  title: string;
  company: string;
  description: string;
  location: string;
  relevanceScore: number;
  applyUrl: string;
};

type RecommendationCardProps = {
  recommendation: Recommendation;
};

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [roadmap, setRoadmap] = useState<GenerateRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const relevancePercentage = Math.round(recommendation.relevanceScore * 100);

  const handleFetchRoadmap = async () => {
    setIsLoading(true);
    setRoadmap(null);
    try {
      const result = await getRoadmap({
        internshipTitle: recommendation.title,
        companyName: recommendation.company,
      });
      setRoadmap(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate the roadmap. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
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
            <div className="flex gap-2">
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleFetchRoadmap}>
                  <Route className="mr-2 h-4 w-4" />
                  Roadmap
                </Button>
              </DialogTrigger>
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href={recommendation.applyUrl} target="_blank">
                  Apply Now
                </Link>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">
            Your Roadmap to a {recommendation.title} at {recommendation.company}
          </DialogTitle>
          <DialogDescription>
            Follow these steps to maximize your chances of getting the internship.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 max-h-[60vh] overflow-y-auto pr-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {roadmap && (
            <ol className="relative border-l border-border ml-4">
              {roadmap.roadmap.map((step, index) => (
                <li key={index} className="mb-10 ml-8">
                  <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-secondary rounded-full ring-8 ring-background">
                    <span className="font-bold text-primary">{step.step}</span>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                    Step {step.step}
                  </p>
                  <p className="mb-4 text-base font-normal text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
