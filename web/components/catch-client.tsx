"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CatchClientProps {
  question: string;
}

export function CatchClient({ question }: CatchClientProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit() {
    if (!answer.trim() || isLoading) return;
    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL as string}/catch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ answer }),
        },
      );
      const data = await res.json();

      if (data.correct) {
        router.refresh();
      } else {
        setError(true);
      }
      setAnswer("");
      inputRef.current?.focus();
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 px-6 py-32 max-w-sm w-full">
        <p className="text-lg font-medium text-center">{question}</p>

        <div className="flex gap-2 w-full">
          <Input
            ref={inputRef}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your answer"
            disabled={isLoading}
          />
          <Button onClick={handleSubmit} disabled={isLoading || !answer.trim()}>
            Submit
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive">Incorrect, try again.</p>
        )}
      </div>
    </div>
  );
}
