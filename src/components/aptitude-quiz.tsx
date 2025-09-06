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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, BrainCircuit, Sparkles, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getAptitudeQuiz } from "@/app/actions";
import type { GenerateAptitudeQuizOutput } from "@/ai/flows/generate-aptitude-quiz";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  companyName: z.string().min(2, "Please enter a company name."),
});

type QuizState = "idle" | "loading" | "in_progress" | "results";
type SelectedAnswers = { [key: number]: string };

export default function AptitudeQuiz() {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [quizData, setQuizData] = useState<GenerateAptitudeQuizOutput | null>(
    null
  );
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [score, setScore] = useState(0);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
    },
  });

  const handleStartQuiz = async (values: z.infer<typeof formSchema>) => {
    setQuizState("loading");
    setQuizData(null);
    setSelectedAnswers({});
    setScore(0);
    try {
      const result = await getAptitudeQuiz(values);
      if (result.quiz.questions.length === 0) {
        toast({
          variant: "destructive",
          title: "Quiz Generation Failed",
          description: `Could not generate a quiz for ${values.companyName}. Please try another company.`,
        });
        setQuizState("idle");
        return;
      }
      setQuizData(result);
      setQuizState("in_progress");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate the quiz. Please try again later.",
      });
      setQuizState("idle");
    }
  };

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitQuiz = () => {
    if (!quizData) return;

    let correctAnswers = 0;
    quizData.quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setQuizState("results");
     window.scrollTo(0, 0);
  };
  
  const restartQuiz = () => {
    setQuizState("idle");
    setQuizData(null);
    setSelectedAnswers({});
    setScore(0);
    form.reset();
  }

  const renderContent = () => {
    switch (quizState) {
      case "idle":
      case "loading":
        return (
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-headline">
                Company-Specific Aptitude Quiz
              </CardTitle>
              <CardDescription className="text-center">
                Enter a company name to generate a tailored aptitude test.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleStartQuiz)}>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Google, Tata, Infosys"
                    {...form.register("companyName")}
                    disabled={quizState === "loading"}
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.companyName.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={quizState === "loading"}
                  className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  {quizState === "loading" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Quiz
                </Button>
              </form>
            </CardContent>
          </Card>
        );
      case "in_progress":
        return (
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-headline">
                Aptitude Quiz for {quizData?.quiz.companyName}
              </CardTitle>
              <CardDescription className="text-center">
                Answer all the questions below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {quizData?.quiz.questions.map((q, index) => (
                <div key={index}>
                  <p className="font-semibold mb-4">
                    {index + 1}. {q.question}
                  </p>
                  <RadioGroup
                    onValueChange={(value) => handleAnswerChange(index, value)}
                  >
                    {q.options.map((option, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                        <Label htmlFor={`q${index}-o${i}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmitQuiz}
                className="w-full"
                size="lg"
                disabled={
                  Object.keys(selectedAnswers).length !==
                  quizData?.quiz.questions.length
                }
              >
                Submit & See Results
              </Button>
            </CardFooter>
          </Card>
        );
      case "results":
        return (
             <div className="space-y-8">
                <Card className="shadow-lg border-2 border-accent/30 text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Quiz Results</CardTitle>
                        <CardDescription>For {quizData?.quiz.companyName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold text-primary">{score} / {quizData?.quiz.questions.length}</p>
                        <p className="mt-2 text-muted-foreground">That's a great effort! Review the explanations below.</p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                         <Button onClick={restartQuiz}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Take Another Quiz
                        </Button>
                    </CardFooter>
                </Card>

                {quizData?.quiz.questions.map((q, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                        <Card key={index} className={`shadow-lg border-2 ${isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
                            <CardHeader>
                                 <CardTitle className="flex justify-between items-start">
                                    <span className="flex-1">{index + 1}. {q.question}</span>
                                    {isCorrect ? 
                                        <Check className="h-6 w-6 text-green-600 flex-shrink-0" /> : 
                                        <X className="h-6 w-6 text-red-600 flex-shrink-0" />
                                    }
                                </CardTitle>
                                <Badge variant="secondary">{q.category}</Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2 text-sm">
                                    {q.options.map((option, i) => (
                                        <li key={i} className={`flex items-center p-2 rounded-md ${
                                            option === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/30' : 
                                            option === userAnswer ? 'bg-red-100 dark:bg-red-900/30' : ''
                                        }`}>
                                            {option === q.correctAnswer && <Check className="h-4 w-4 mr-2 text-green-700 dark:text-green-400" />}
                                            {option !== q.correctAnswer && option === userAnswer && <X className="h-4 w-4 mr-2 text-red-700 dark:text-red-400" />}
                                            {option !== q.correctAnswer && option !== userAnswer && <div className="w-4 mr-2" />}
                                            <span>{option}</span>
                                            {option === userAnswer && <Badge variant="outline" className="ml-auto">Your Answer</Badge>}
                                        </li>
                                    ))}
                                </ul>
                                 <div className="p-3 bg-muted/50 rounded-md">
                                    <p className="font-semibold">Explanation</p>
                                    <p className="text-muted-foreground text-sm">{q.explanation}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                 <div className="text-center">
                    <Button onClick={restartQuiz} size="lg">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Take Another Quiz
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
          <BrainCircuit className="inline-block h-10 w-10 mr-4" />
          Aptitude Challenge
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Sharpen your skills with a quiz tailored to the company you're
          interviewing with.
        </p>
      </section>

      <section className="mt-8 md:mt-12 max-w-2xl mx-auto">
        {renderContent()}
      </section>
    </div>
  );
}
