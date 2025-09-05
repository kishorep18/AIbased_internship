"use client";

import { useState } from "react";
import type { ConductInterviewOutput } from "@/ai/flows/mock-interview";
import { getInterviewQuestions } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MockInterview() {
  const [resume, setResume] = useState<File | null>(null);
  const [interviewState, setInterviewState] = useState<ConductInterviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Allow PDF, text, and markdown files
      if (["application/pdf", "text/plain", "text/markdown"].includes(file.type)) {
        setResume(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a PDF, TXT, or MD file.",
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
    setInterviewState(null);

    // We need to read the file content as text.
    // PDFs are tricky on the client, so we will show a message for now.
    // In a real app, you'd use a library like pdf.js or do this on the server.
    if (resume.type === 'application/pdf') {
       toast({
          variant: "destructive",
          title: "PDF processing not supported yet",
          description: "Please use a .txt or .md file for now. PDF analysis is coming soon!",
        });
      setIsLoading(false);
      return;
    }
    
    const reader = new FileReader();
    reader.readAsText(resume);
    reader.onload = async (e) => {
        const resumeText = e.target?.result as string;
        if (!resumeText) {
            toast({ variant: "destructive", title: "Could not read resume file." });
            setIsLoading(false);
            return;
        }

        try {
            const result = await getInterviewQuestions({ resumeText });
            if (result.initialQuestions.length === 0) {
                toast({
                    title: "Could not generate questions",
                    description: "The AI could not generate questions from your resume. Please try a different file.",
                });
            }
            setInterviewState(result);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "An error occurred",
                description: "Failed to start interview. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    reader.onerror = () => {
        toast({ variant: "destructive", title: "Error reading file" });
        setIsLoading(false);
    };
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

      {!interviewState && (
        <section className="mt-8 md:mt-12 max-w-2xl mx-auto">
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-headline">
                Upload Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="resume">Resume (PDF, TXT, MD)</Label>
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
      )}
      
      {isLoading && !interviewState && (
         <div className="mt-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing your resume and preparing questions...</p>
         </div>
      )}

      {interviewState && (
        <section className="mt-12 max-w-4xl mx-auto">
            <Card className="shadow-xl border-2 border-primary/20">
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline text-center">Your Mock Interview</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="text-center">
                        <Bot className="h-8 w-8 mx-auto text-accent" />
                        <p className="mt-2 text-muted-foreground">The AI has generated the following questions based on your resume. Take your time to answer them.</p>
                    </div>
                    <div className="space-y-8">
                        {interviewState.initialQuestions.map((q, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0">
                                   <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                     {i+1}
                                   </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{q.question}</p>
                                    <Badge variant="secondary" className="mt-2">{q.category}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                     <div className="text-center pt-4">
                        <Button onClick={() => { setInterviewState(null); setResume(null); }} variant="outline">
                            Start New Interview
                        </Button>
                    </div>
                 </CardContent>
            </Card>
        </section>
      )}

    </div>
  );
}
