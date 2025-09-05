import InternshipFinder from '@/components/internship-finder';
import { GraduationCap, Briefcase, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
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
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/mock-interview"
            >
              <Briefcase className="inline-block mr-2 h-5 w-5" />
              Mock Interview
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground"
              href="/login"
            >
              <LogIn className="inline-block mr-2 h-5 w-5" />
              Login
            </Link>
          </nav>
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
