
"use client";

import { useState, useEffect } from 'react';
import MockInterview from '@/components/mock-interview';
import { GraduationCap, Briefcase, FileText, Route, Home as HomeIcon, Bot, LogOut, User, Compass } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function MockInterviewPage() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  const navLinks = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/career-navigator', label: 'Career Navigator', icon: Compass },
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
                SkillPath AI
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
