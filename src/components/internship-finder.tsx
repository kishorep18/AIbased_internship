"use client";

import { useState } from "react";
import type { RecommendInternshipsInput, RecommendInternshipsOutput } from "@/ai/flows/recommend-internships";
import { getInternshipRecommendations } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { InternshipForm } from "@/components/internship-form";
import { RecommendationCard } from "@/components/recommendation-card";
import { RecommendationSkeleton } from "@/components/recommendation-skeleton";

export default function InternshipFinder() {
  const [recommendations, setRecommendations] = useState<RecommendInternshipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async (data: RecommendInternshipsInput) => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await getInternshipRecommendations(data);
      if (result.internshipRecommendations.length === 0) {
        toast({
            title: "No matches found",
            description: "We couldn't find internships matching your profile. Try adjusting your preferences.",
        });
      }
      setRecommendations(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get recommendations. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
          Find Your Perfect Internship
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Tell us about yourself, and our AI will suggest the most relevant internships for you from hundreds of opportunities.
        </p>
      </section>

      <section className="mt-8 md:mt-12 max-w-2xl mx-auto">
        <InternshipForm onSubmit={handleGetRecommendations} isLoading={isLoading} />
      </section>

      <section className="mt-12">
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <RecommendationSkeleton />
            <RecommendationSkeleton />
            <RecommendationSkeleton />
          </div>
        )}
        {recommendations && recommendations.internshipRecommendations.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-headline">
              Here are your top recommendations
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.internshipRecommendations.map((rec, index) => (
                <RecommendationCard key={index} recommendation={rec} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
