
"use client";

import { useState, useEffect } from 'react';
import AptitudeQuiz from '@/components/aptitude-quiz';
import { GraduationCap, Briefcase, FileText, Route, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/app/actions';

export default function AptitudeQuizPage() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/mock-interview', label: 'Mock Interview', icon: Briefcase },
    { href: '/roadmap', label: 'Roadmap', icon: Route },
    { href: '/aptitude-quiz', label: 'Aptitude Quiz', icon: FileText },
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
        <AptitudeQuiz />
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
