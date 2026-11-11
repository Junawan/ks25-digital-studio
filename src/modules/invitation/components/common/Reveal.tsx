"use client";

import { useEffect, useRef, useState } from "react";

type Direction =
  | "up"
  | "left"
  | "right"
  | "scale";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
}

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const element = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = element.current;
    if (!node || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={element}
      className={`invitation-reveal ${visible ? "is-visible" : ""} ${direction !== "up" ? `invitation-reveal--${direction}` : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

}
