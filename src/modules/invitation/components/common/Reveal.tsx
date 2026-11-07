"use client";

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

  return (
    <div className={`fade-in ${direction === "scale" ? "fade-scale" : ""}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );

}
