"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Route, Sparkles, Book, UserCheck, MessageSquare, Briefcase, Trophy } from "lucide-react";
import { getRoadmap } from "@/app/actions";
import type { GenerateRoadmapOutput } from "@/ai/flows/generate-roadmap";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  internshipTitle: z.string().min(2, "Please enter an internship title."),
  companyName: z.string().min(2, "Please enter a company name."),
});

type RoadmapState = "idle" | "loading" | "results";

const stepIcons = [
    Book,
    UserCheck,
    MessageSquare,
    Briefcase,
    Trophy,
    Trophy,
    Trophy
]

export default function RoadmapGenerator() {
  const [roadmapState, setRoadmapState] = useState<RoadmapState>("idle");
  const [roadmapData, setRoadmapData] = useState<GenerateRoadmapOutput | null>(null);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      internshipTitle: "",
      companyName: "",
    },
  });

  const handleGenerateRoadmap = async (values: z.infer<typeof formSchema>) => {
    setRoadmapState("loading");
    setRoadmapData(null);
    try {
      const result = await getRoadmap(values);
      if (result.roadmap.length === 0) {
        toast({
          variant: "destructive",
          title: "Roadmap Generation Failed",
          description: "Could not generate a roadmap. Please try again.",
        });
        setRoadmapState("idle");
        return;
      }
      setRoadmapData(result);
      setRoadmapState("results");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate the roadmap. Please try again later.",
      });
      setRoadmapState("idle");
    }
  };
  
  const restart = () => {
    setRoadmapState("idle");
    setRoadmapData(null);
    form.reset();
  }

  const renderContent = () => {
    switch (roadmapState) {
      case "idle":
      case "loading":
        return (
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-headline">
                Generate a Career Roadmap
              </CardTitle>
              <CardDescription className="text-center">
                Enter an internship and company to get your personalized roadmap.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleGenerateRoadmap)} className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="internshipTitle">Internship Title</Label>
                  <Input
                    id="internshipTitle"
                    placeholder="e.g., Software Engineering Intern"
                    {...form.register("internshipTitle")}
                    disabled={roadmapState === "loading"}
                  />
                  {form.formState.errors.internshipTitle && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.internshipTitle.message}
                    </p>
                  )}
                </div>
                 <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Google, Microsoft"
                    {...form.register("companyName")}
                    disabled={roadmapState === "loading"}
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.companyName.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={roadmapState === "loading"}
                  className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  {roadmapState === "loading" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Roadmap
                </Button>
              </form>
            </CardContent>
          </Card>
        );
      case "results":
        return (
            <div className="space-y-8">
                <Card className="shadow-lg border-2 border-accent/30">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-headline">Your Roadmap to Success</CardTitle>
                        <CardDescription>
                            For {form.getValues("internshipTitle")} at {form.getValues("companyName")}
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="flex flex-col items-center">
                  <div className="relative w-full p-8">
                    <div className="flex flex-col-reverse w-full">
                      {roadmapData?.roadmap.map((step, index) => {
                        const Icon = stepIcons[index] || Trophy;
                        return (
                          <div
                            key={step.step}
                            className="transform transition-all duration-300 ease-in-out hover:scale-105"
                            style={{
                              paddingLeft: `${index * 8}%`,
                              zIndex: roadmapData.roadmap.length - index,
                            }}
                          >
                            <div
                              className={`relative p-6 rounded-t-lg shadow-lg mb-1 flex items-start gap-6`}
                              style={{ 
                                backgroundColor: `hsl(var(--primary) / ${1 - index * 0.1})`,
                                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 10% 100%, 0 80%)'
                              }}
                            >
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-12 h-12 bg-background/20 rounded-full text-white">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-center text-white font-bold mt-2">STEP {step.step}</div>
                                </div>
                                <div className="text-white">
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-sm opacity-90">{step.description}</p>
                                </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                 <div className="text-center pt-8">
                    <Button onClick={restart} size="lg">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Another Roadmap
                    </Button>
                </div>
            </div>
        )
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
          <Route className="inline-block h-10 w-10 mr-4" />
          Your Career Roadmap
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Get a personalized, step-by-step guide to landing your dream internship.
        </p>
      </section>

      <section className="mt-8 md:mt-12 max-w-4xl mx-auto">
        {renderContent()}
      </section>
    </div>
  );
}
