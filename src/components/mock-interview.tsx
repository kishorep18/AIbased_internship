
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ConductInterviewOutput } from "@/ai/flows/mock-interview";
import type { AnalyzeVideoFeedbackOutput } from "@/ai/flows/analyze-video-feedback";
import { getInterviewQuestions, getVideoFeedback } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Video, ArrowRight, RefreshCw, Mic, MicOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { FeedbackCard } from "@/components/feedback-card";
import { Textarea } from "@/components/ui/textarea";

type FeedbackWithQuestion = AnalyzeVideoFeedbackOutput & { question: string };

export default function MockInterview() {
  const [resumeText, setResumeText] = useState<string>("");
  const [interviewState, setInterviewState] = useState<ConductInterviewOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [feedbackResults, setFeedbackResults] = useState<FeedbackWithQuestion[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const { toast } = useToast();

  const startRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
      recordedChunksRef.current = [];
      mediaRecorderRef.current.start();
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      return new Promise((resolve) => {
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
          recordedChunksRef.current = [];
          resolve(blob);
        };
        mediaRecorderRef.current.stop();
      });
    }
    return null;
  }, []);

  const setupMediaRecorder = useCallback((stream: MediaStream) => {
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    mediaRecorderRef.current = recorder;
    startRecording();
  }, [startRecording]);

  useEffect(() => {
    if (interviewState && !showFeedback) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
          setupMediaRecorder(stream);
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
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }
    }
  }, [interviewState, showFeedback, setupMediaRecorder, toast]);


  const handleStartInterview = async () => {
    if (!resumeText.trim()) {
      toast({
        variant: "destructive",
        title: "Resume text is empty",
        description: "Please paste your resume content to start the interview.",
      });
      return;
    }

    setIsLoading(true);
    setInterviewState(null);
    setShowFeedback(false);
    setFeedbackResults([]);
    setCurrentQuestionIndex(0);
    
    try {
        const result = await getInterviewQuestions({ resumeText });
        if (result.initialQuestions.length === 0) {
            toast({
                title: "Could not generate questions",
                description: "The AI could not generate questions from your resume. Please try again with different content.",
            });
        }
        setInterviewState(result);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "An error occurred",
            description: error.message || "Failed to start interview. Please try again later.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const processVideoAndGetFeedback = async (question: string) => {
    const videoBlob = await stopRecording();
    if (videoBlob) {
      setIsAnalyzing(true);
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        reader.onloadend = async () => {
            const videoDataUri = reader.result as string;
            try {
              const feedback = await getVideoFeedback({ videoDataUri, question });
              setFeedbackResults(prev => [...prev, { ...feedback, question }]);
            } catch (error) {
              toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "Could not analyze your response for this question.",
              });
            } finally {
              setIsAnalyzing(false);
              resolve();
            }
        };
      });
    }
  };

  const handleNextQuestion = async () => {
    if (interviewState && currentQuestionIndex < interviewState.initialQuestions.length - 1) {
      await processVideoAndGetFeedback(interviewState.initialQuestions[currentQuestionIndex].question);
      setCurrentQuestionIndex(prev => prev + 1);
      startRecording();
    }
  };

  const handleFinishInterview = async () => {
    if (interviewState) {
      await processVideoAndGetFeedback(interviewState.initialQuestions[currentQuestionIndex].question);
    }
    setShowFeedback(true);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const resetInterview = () => {
    setInterviewState(null);
    setResumeText("");
    setHasCameraPermission(null);
    setCurrentQuestionIndex(0);
    setFeedbackResults([]);
    setShowFeedback(false);
  };

  if (showFeedback) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
            Interview Feedback
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Here's a breakdown of your performance. Use this to improve for your next real interview!
          </p>
        </section>
        <section className="mt-12 max-w-4xl mx-auto space-y-8">
          {isAnalyzing && feedbackResults.length < (interviewState?.initialQuestions.length || 0) ? (
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-muted-foreground">Analyzing your final answer...</p>
            </div>
          ) : (
            <>
              {feedbackResults.map((feedback, index) => (
                <FeedbackCard key={index} feedback={feedback} index={index} />
              ))}
              <div className="text-center">
                <Button onClick={resetInterview} size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start a New Interview
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">
          AI Mock Interview
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Paste your resume, and our AI will conduct a real-time video mock interview based on your skills and experience.
        </p>
      </section>

      {!interviewState && (
        <section className="mt-8 md:mt-12 max-w-2xl mx-auto">
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-headline">
                Paste Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="resume-text">Resume Content</Label>
                <Textarea
                  id="resume-text"
                  placeholder="Paste your resume content here..."
                  className="min-h-[200px]"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleStartInterview}
                disabled={isLoading || !resumeText.trim()}
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

      {interviewState && !showFeedback && (
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
                            <Button onClick={handleFinishInterview} variant="destructive" disabled={isAnalyzing}>
                                End Interview
                            </Button>
                             {isAnalyzing ? (
                                <Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </Button>
                             ) : currentQuestionIndex < interviewState.initialQuestions.length - 1 ? (
                                <Button onClick={handleNextQuestion}>
                                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleFinishInterview} className="bg-green-600 hover:bg-green-700">
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
                        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/50 text-white p-2 rounded-md">
                          {mediaRecorderRef.current?.state === "recording" ? (
                            <>
                              <Mic className="h-5 w-5 text-red-500 animate-pulse" />
                              <span>Recording...</span>
                            </>
                          ) : (
                            <>
                              <MicOff className="h-5 w-5 text-muted-foreground" />
                              <span>Not Recording</span>
                            </>
                          )}
                        </div>
                         <div className="text-center mt-2">
                             <Button onClick={resetInterview} variant="outline" size="sm">
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
