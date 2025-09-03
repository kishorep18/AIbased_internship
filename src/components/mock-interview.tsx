"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";

export default function MockInterview() {
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.includes("text")) {
        setResume(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF or text file.",
        });
      }
    }
  };

  const handleStartInterview = async () => {
    if (!resume) {
      toast({
        variant: "destructive",
        title: "No resume selected",
        description: "Please upload your resume to start the interview.",
      });
      return;
    }

    setIsLoading(true);
    // TODO: Implement the logic to read the file and start the interview
    toast({
      title: "Feature in development",
      description: "The mock interview feature is still being built.",
    });
    console.log("Starting interview with resume:", resume.name);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
          AI Mock Interview
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your resume and our AI will conduct a mock interview based on your skills and experience.
        </p>
      </section>

      <section className="mt-8 md:mt-12 max-w-2xl mx-auto">
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-headline">
              Upload Your Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resume">Resume (PDF or Text)</Label>
              <Input id="resume" type="file" accept=".pdf,.txt,.md" onChange={handleFileChange} disabled={isLoading} />
            </div>
            {resume && (
              <p className="text-sm text-muted-foreground">Selected file: {resume.name}</p>
            )}
            <Button
              onClick={handleStartInterview}
              disabled={isLoading || !resume}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </section>
      
      {/* The chat interface will go here in the next steps */}

    </div>
  );
}
