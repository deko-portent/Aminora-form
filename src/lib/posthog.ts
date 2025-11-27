"use client";

import posthog from "posthog-js";

declare global {
  interface Window {
    __posthogInitialized?: boolean;
  }
}

export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";

export function initPostHog() {
  if (typeof window === "undefined" || window.__posthogInitialized) {
    return;
  }

  if (!POSTHOG_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog key is missing – analytics disabled.");
    }
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: "identified_only",
    disable_session_recording: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    autocapture: false, // HIPAA safe – explicit events only
    loaded: () => {
      window.__posthogInitialized = true;
    },
  });
}

export default posthog;


