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
  User,
  Cake,
  CalendarIcon,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import type { RecommendInternshipsInput } from "@/ai/flows/recommend-internships";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  age: z.string().min(1, "Please enter your age."),
  dob: z.date({ required_error: "A date of birth is required." }),
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
      name: "",
      age: "",
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
      dob: format(values.dob, 'PPP'),
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <User className="inline-block mr-2 h-4 w-4" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., John Doe"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Cake className="inline-block mr-2 h-4 w-4" />
                      Age
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 21"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    <CalendarIcon className="inline-block mr-2 h-4 w-4" />
                    Date of Birth
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={new Date().getFullYear()}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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