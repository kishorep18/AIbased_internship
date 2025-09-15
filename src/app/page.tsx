
"use client";

import { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, FileText, Route, UserPlus, Target, FileCheck, Home as HomeIcon, Bot, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { signOutUser } from './actions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Home() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/internship-finder', label: 'InternMatch AI', icon: Bot },
    { href: '/mock-interview', label: 'Mock Interview', icon: Briefcase },
    { href: '/roadmap', label: 'Roadmap', icon: Route },
    { href: '/aptitude-quiz', label: 'Aptitude Quiz', icon: FileText },
  ];

  const workingSteps = [
    {
      icon: <UserPlus className="h-10 w-10 text-primary" />,
      title: "Create Your Profile",
      description: "Tell us about your skills, interests, and educational background.",
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Get AI Recommendations",
      description: "Our AI analyzes your profile to find the best internship matches.",
    },
    {
      icon: <FileCheck className="h-10 w-10 text-primary" />,
      title: "Land Your Internship",
      description: "Use our tools like the Roadmap Generator and Mock Interview to prepare and succeed.",
    },
  ];

  const features = [
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: "InternMatch AI",
      description: "Our core feature. Fill out your profile and let our AI find the most relevant internships for you from hundreds of opportunities.",
      href: "/internship-finder"
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: "Mock Interview",
      description: "Upload your resume and our AI will conduct a real-time video mock interview based on your skills and experience.",
      href: "/mock-interview"
    },
    {
      icon: <Route className="h-10 w-10 text-primary" />,
      title: "Roadmap",
      description: "Get a personalized, step-by-step guide to landing your dream internship at a specific company.",
      href: "/roadmap"
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Aptitude Quiz",
      description: "Sharpen your skills with a quiz tailored to the company you're interviewing with, covering logical, quantitative, and verbal abilities.",
      href: "/aptitude-quiz"
    }
  ]

  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="mr-4 flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block font-headline">
                InternMatch AI
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  (pathname === link.href) ? "text-foreground" : "text-foreground/60"
                )}
                href={link.href}
              >
                <link.icon className="inline-block mr-2 h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {!loading && user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ''} alt="User Avatar" />
                    <AvatarFallback>
                      {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{user.displayName || 'User'}</span>
                </div>
                <form action={signOutUser}>
                  <Button variant="ghost" size="sm" type="submit">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold font-headline text-primary">Your All-in-One Internship Platform</h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                        From finding the perfect opportunity to acing the interview, we've got you covered.
                    </p>
                </div>
            </div>
        </section>

        <section id="features" className="py-12 md:py-20 bg-muted/50">
           <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Features</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                All the tools you need to find and land your dream internship.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <Card key={index} className="text-center shadow-lg border-2 border-primary/10 transform hover:-translate-y-2 transition-transform duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl font-bold font-headline">{feature.title}</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild>
                        <Link href={feature.href}>{feature.title === 'InternMatch AI' ? 'Find Internships' : `Go to ${feature.title}`}</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple, streamlined process to connect you with your future.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {workingSteps.map((step, index) => (
                <Card key={index} className="text-center shadow-lg border-2 border-primary/10">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                      {step.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
            A functional prototype for the Smart India Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}
