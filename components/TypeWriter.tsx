"use client";

import { useEffect, useState } from "react";

interface Props {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function TypeWriter({
  words,
  className = "",
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseTime = 2000,
}: Props) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[index];

    if (!isDeleting && text === current) {
      const pause = setTimeout(() => setIsDeleting(true), pauseTime);
      return () => clearTimeout(pause);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setText(
          isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1)
        );
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className}>
      {text}
      <span className="animate-blink text-accent">|</span>
    </span>
  );
}
