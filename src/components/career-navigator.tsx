
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Compass, Sparkles, Zap, Gem, Gauge, Clock, StepForward, Award, Briefcase, Building, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCareerPathway } from "@/app/actions";
import type { GenerateCareerPathwayInput, GenerateCareerPathwayOutput } from "@/ai/flows/generate-career-pathway";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  age: z.string().min(1, "Please enter your age."),
  location: z.string().min(2, "Please enter your location."),
  highestQualification: z.string().min(3, "Please enter your highest qualification."),
  currentSkills: z.string().min(3, "Please list at least one skill."),
  desiredRole: z.string().min(3, "Please enter your desired job role."),
  industry: z.string().min(2, "Please enter your target industry."),
});

const pathwayIcons = {
  "Fast-Track": Zap,
  "Budget-Friendly": Gem,
  "Step-by-Step": Gauge,
};

const stepIcons = {
    "Course": Award,
    "Certification": Award,
    "Apprenticeship": Briefcase,
    "Job": Building,
}

export default function CareerNavigator() {
  const [pathwayData, setPathwayData] = useState<GenerateCareerPathwayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      location: "",
      highestQualification: "",
      currentSkills: "",
      desiredRole: "",
      industry: "",
    },
  });

  const handleGetPathway = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setPathwayData(null);
    try {
      const skillsArray = values.currentSkills
        .split(/[,\\n]+/)
        .map((skill) => skill.trim())
        .filter(Boolean);

      const input: GenerateCareerPathwayInput = {
        personalProfile: {
          name: values.name,
          age: values.age,
          location: values.location,
        },
        educationAndSkills: {
          highestQualification: values.highestQualification,
          currentSkills: skillsArray,
        },
        careerAspirations: {
          desiredRole: values.desiredRole,
          industry: values.industry,
        },
      };

      const result = await getCareerPathway(input);
      if (result.pathways.length === 0) {
        toast({
          title: "No pathway found",
          description: "We couldn't generate a career pathway based on your profile. Please try adjusting your inputs.",
        });
      }
      setPathwayData(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate a career pathway. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setPathwayData(null);
    setIsLoading(false);
    form.reset();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
          <Compass className="inline-block h-10 w-10 mr-4" />
          AI Career Navigator
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personalized guide to professional success, mapped to the NSQF framework and current market demand.
        </p>
      </section>

      {!pathwayData && (
        <section className="mt-8 md:mt-12 max-w-2xl mx-auto">
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-headline">Create Your Learner Profile</CardTitle>
              <CardDescription className="text-center">Tell us about yourself to generate your custom career pathways.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGetPathway)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Anjali Sharma" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 21" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pune, Maharashtra" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="highestQualification" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Qualification</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., B.Tech in IT" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="currentSkills" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Skills</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Java, Python, Communication" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormDescription>Enter skills separated by commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="desiredRole" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Job Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full Stack Developer" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Information Technology" disabled={isLoading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate My Pathways
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      )}

      {isLoading && !pathwayData && (
          <div className="text-center mt-12">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Analyzing your profile and mapping pathways...</p>
          </div>
      )}

      {pathwayData && (
        <section className="mt-12 max-w-5xl mx-auto">
            <Card className="shadow-lg border-2 border-accent/30 text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Your Personalized Career Pathways</CardTitle>
                    <CardDescription>
                        For {form.getValues("desiredRole")} in the {form.getValues("industry")} industry.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue={pathwayData.pathways[0]?.pathwayType} className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-3">
                    {pathwayData.pathways.map(p => {
                        const Icon = pathwayIcons[p.pathwayType as keyof typeof pathwayIcons] || StepForward;
                        return (
                            <TabsTrigger key={p.pathwayType} value={p.pathwayType}>
                                <Icon className="mr-2 h-4 w-4" />
                                {p.pathwayType}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
                 {pathwayData.pathways.map(p => (
                    <TabsContent key={p.pathwayType} value={p.pathwayType}>
                        <Card className="mt-2 border-primary/20">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl font-headline">{p.pathwayType} Pathway</CardTitle>
                                    <div className="flex items-center text-muted-foreground">
                                        <Clock className="mr-2 h-5 w-5" />
                                        <span className="font-semibold">{p.estimatedTimeToGoal}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ol className="relative border-l border-border ml-4">
                                  {p.careerDashboard.map((step, index) => {
                                      const Icon = stepIcons[step.type as keyof typeof stepIcons] || StepForward;
                                      return (
                                        <li key={index} className="mb-10 ml-8">
                                          <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-secondary rounded-full ring-8 ring-background">
                                            <Icon className="w-4 h-4 text-primary"/>
                                          </span>
                                          <h3 className="flex items-center mb-1 text-lg font-semibold text-foreground">
                                            {step.title}
                                            {step.nsqfLevel && <Badge className="ml-3">NSQF {step.nsqfLevel}</Badge>}
                                          </h3>
                                           <p className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                                            Step {step.step} &bull; {step.type}
                                          </p>
                                          <p className="mb-4 text-base font-normal text-muted-foreground">
                                            {step.description}
                                          </p>
                                        </li>
                                      )
                                  })}
                                </ol>
                            </CardContent>
                        </Card>
                    </TabsContent>
                 ))}
            </Tabs>
             <div className="text-center mt-8">
                <Button onClick={restart} size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Over
                </Button>
            </div>
        </section>
      )}

    </div>
  );
}
