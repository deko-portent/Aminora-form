"use client";

import { getSessionId } from "./session";

type RequestOptions = RequestInit & {
  headers?: HeadersInit;
};

export async function proxyFetch(input: RequestInfo, init: RequestOptions = {}) {
  const sessionId = getSessionId();
  const headers = new Headers(init.headers || {});

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("X-Client-Correlation-Id", sessionId);

  return fetch(input, {
    ...init,
    headers,
  });
}

