"use client";

import { useState, useRef, useEffect } from "react";
import type { ConductInterviewOutput } from "@/ai/flows/mock-interview";
import { getInterviewQuestionsFromResume } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Bot, Video, ArrowRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export default function MockInterview() {
  const [resume, setResume] = useState<File | null>(null);
  const [interviewState, setInterviewState] = useState<ConductInterviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (interviewState) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings to continue.",
          });
        }
      };

      getCameraPermission();
      
      return () => {
        // Stop camera stream when component unmounts or interview ends
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [interviewState, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    setCurrentQuestionIndex(0);
    
    const formData = new FormData();
    formData.append('resume', resume);

    try {
        const result = await getInterviewQuestionsFromResume(formData);
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

  const handleNextQuestion = () => {
    if (interviewState && currentQuestionIndex < interviewState.initialQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleEndInterview = () => {
    setInterviewState(null);
    setResume(null);
    setHasCameraPermission(null);
    setCurrentQuestionIndex(0);
    // Logic to show feedback will go here
    toast({
        title: "Interview Ended",
        description: "Great job! Feedback feature coming soon.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
          AI Mock Interview
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your resume, and our AI will conduct a real-time video mock interview based on your skills and experience.
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
              <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
                <Label htmlFor="resume">Resume (PDF, TXT, MD)</Label>
                <Input id="resume" type="file" accept=".pdf,.txt,.md" onChange={handleFileChange} disabled={isLoading} />
              </div>
              {resume && (
                <p className="text-sm text-muted-foreground text-center">Selected file: {resume.name}</p>
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
                  <Video className="mr-2 h-4 w-4" />
                )}
                Start Video Interview
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
        <section className="mt-12 max-w-5xl mx-auto">
            <Card className="shadow-xl border-2 border-primary/20">
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline text-center">Live Mock Interview</CardTitle>
                 </CardHeader>
                 <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                        <div className="p-6 rounded-lg bg-muted/50 min-h-[200px] flex flex-col justify-center">
                            <div className="flex gap-4">
                               <div className="flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                    {currentQuestionIndex + 1}
                                  </div>
                               </div>
                               <div>
                                   <p className="font-semibold text-lg">{interviewState.initialQuestions[currentQuestionIndex].question}</p>
                                   <Badge variant="secondary" className="mt-2">{interviewState.initialQuestions[currentQuestionIndex].category}</Badge>
                               </div>
                           </div>
                        </div>

                         <div className="flex justify-between items-center gap-4">
                            <Button onClick={handleEndInterview} variant="destructive">
                                End Interview
                            </Button>
                             {currentQuestionIndex < interviewState.initialQuestions.length - 1 ? (
                                <Button onClick={handleNextQuestion}>
                                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleEndInterview} className="bg-green-600 hover:bg-green-700">
                                    Finish & Get Feedback
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="relative">
                        <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
                         {hasCameraPermission === false && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                               <Alert variant="destructive" className="w-auto">
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please allow camera access to use this feature.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                         <div className="text-center mt-2">
                             <Button onClick={() => { setInterviewState(null); setResume(null); }} variant="outline" size="sm">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Start Over
                            </Button>
                        </div>
                    </div>
                 </CardContent>
            </Card>
        </section>
      )}

    </div>
  );
}
