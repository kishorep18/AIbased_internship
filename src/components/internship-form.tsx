"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  BookOpen,
  Briefcase,
  Lightbulb,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendInternshipsInput } from "@/ai/flows/recommend-internships";

const formSchema = z.object({
  education: z.string().min(1, "Please select your education level."),
  skills: z.string().min(3, "Please enter at least one skill."),
  sectorInterests: z.string().min(1, "Please select a sector of interest."),
  location: z.string().min(2, "Please enter your preferred location."),
});

type InternshipFormProps = {
  onSubmit: (data: RecommendInternshipsInput) => void;
  isLoading: boolean;
};

const educationLevels = [
  "High School",
  "Diploma",
  "Bachelors Degree",
  "Masters Degree",
  "PhD",
];
const sectors = [
  "IT",
  "Healthcare",
  "Education",
  "Finance",
  "Marketing",
  "Engineering",
  "Agriculture",
  "Arts & Design",
  "Social Work",
  "Research",
];

export function InternshipForm({ onSubmit, isLoading }: InternshipFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: "",
      skills: "",
      sectorInterests: "",
      location: "",
    },
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    const skillsArray = values.skills
      .split(/[,n]+/)
      .map((skill) => skill.trim())
      .filter(Boolean);
    
    const processedData: RecommendInternshipsInput = {
      ...values,
      skills: skillsArray,
      sectorInterests: [values.sectorInterests],
    };
    onSubmit(processedData);
  }

  return (
    <Card className="shadow-lg border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-headline">
          Create Your Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <BookOpen className="inline-block mr-2 h-4 w-4" />
                    Highest Education
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Lightbulb className="inline-block mr-2 h-4 w-4" />
                    Skills
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Python, Communication, Teamwork"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter skills separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sectorInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Briefcase className="inline-block mr-2 h-4 w-4" />
                    Sector Interest
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sector you're interested in" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <MapPin className="inline-block mr-2 h-4 w-4" />
                    Preferred Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Delhi, Mumbai, or Remote"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Find My Internships
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
