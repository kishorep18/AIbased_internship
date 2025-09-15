
"use client";

import { useState, useEffect } from 'react';
import InternshipFinder from '@/components/internship-finder';
import { GraduationCap, Briefcase, FileText, Route, UserPlus, Target, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { signOutUser } from './actions';


export default function Home() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navLinks = [
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
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
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
              <form action={signOutUser}>
                <Button variant="outline" type="submit">Sign Out</Button>
              </form>
            ) : !loading ? (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <InternshipFinder />

        <section className="py-12 md:py-20 bg-muted/50">
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
