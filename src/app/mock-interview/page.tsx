
"use client";

import { useState, useEffect } from 'react';
import MockInterview from '@/components/mock-interview';
import { GraduationCap, Briefcase, LogIn, LogOut, UserCircle, FileText, Route } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function MockInterviewPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    if (loggedInStatus === 'true' && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    window.location.reload();
  };
  
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
          <nav className="flex items-center space-x-6 text-sm font-medium">
             <Link
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/mock-interview"
            >
              <Briefcase className="inline-block mr-2 h-5 w-5" />
              Mock Interview
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/roadmap"
            >
              <Route className="inline-block mr-2 h-5 w-5" />
              Roadmap
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/aptitude-quiz"
            >
              <FileText className="inline-block mr-2 h-5 w-5" />
              Aptitude Quiz
            </Link>
             {isLoggedIn ? (
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    <span className="text-foreground/80">{userEmail}</span>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-foreground/60 hover:text-foreground/80">
                  <LogOut className="inline-block mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/login"
              >
                <LogIn className="inline-block mr-2 h-5 w-5" />
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <MockInterview />
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
