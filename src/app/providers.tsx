"use client";

import { QuizProvider } from "@/context/QuizContext";
import { PostHogClientProvider } from "@/components/PostHogClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogClientProvider>
      <QuizProvider>{children}</QuizProvider>
    </PostHogClientProvider>
  );
}

