
"use client";

import { useState, useEffect } from 'react';
import InternshipFinder from '@/components/internship-finder';
import { GraduationCap, Briefcase, LogIn, LogOut, UserCircle, FileText, Route } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const pathname = usePathname();

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

  const navLinks = [
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
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
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
                href="/login"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/login" ? "text-foreground" : "text-foreground/60"
                )}
              >
                <LogIn className="inline-block mr-2 h-5 w-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <InternshipFinder />
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
