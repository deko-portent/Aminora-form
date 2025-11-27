"use client";

import { ReactNode, useEffect } from "react";
import { PostHogProvider } from "posthog-js/react";
import posthog, { initPostHog } from "@/lib/posthog";

export function PostHogClientProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}


