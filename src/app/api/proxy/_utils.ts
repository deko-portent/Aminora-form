import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.BASK_API_KEY;
const API_URL = process.env.BASK_API_URL ?? "https://api.bask.health/v1";

if (!API_KEY && process.env.NODE_ENV === "development") {
  console.warn("BASK_API_KEY is not set. Proxy routes will return 500.");
} else if (API_KEY) {
  console.log("Bask API Key loaded:", API_KEY.substring(0, 4) + "...");
}

type ProxyOptions = {
  path: string;
  method: string;
  body?: any;
  authToken?: string; // JWT for patient operations
};

export async function forwardToBask(
  req: NextRequest,
  { path, method, body, authToken }: ProxyOptions
) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "BASK_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const correlationId =
    req.headers.get("x-client-correlation-id") ?? crypto.randomUUID();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "X-Client-Correlation-Id": correlationId,
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const fullUrl = `${API_URL}${path}`;
  console.log(`Proxying to Bask: ${method} ${fullUrl}`);

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).catch((error) => {
    console.error("Bask fetch error:", error);
    return undefined;
  });

  if (!response) {
    return NextResponse.json(
      { error: "Unable to reach Bask API (Network Error)" },
      { status: 502 }
    );
  }

  const text = await response.text();
  
  if (!response.ok) {
    console.error(`Bask Error (${response.status}):`, text);
    // Return the actual error from Bask so we can debug
    return NextResponse.json(
      { error: "Bask API Error", details: text, status: response.status },
      { status: response.status } // Forward the status code (e.g. 401)
    );
  }

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return NextResponse.json(data, {
    status: response.status,
    headers: { "X-Client-Correlation-Id": correlationId },
  });
}
