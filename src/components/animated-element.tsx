"use client";

import { useRef, useEffect, ElementType, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
}

export function AnimatedElement({
  children,
  className,
  as: Component = "div",
  delay = 0,
}: AnimatedElementProps) {
  const el = useRef<Element>(null);

  useEffect(() => {
    const element = el.current;
    if (element) {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [delay]);

  return (
    <Component ref={el} className={cn("opacity-0", className)}>
      {children}
    </Component>
  );
}
