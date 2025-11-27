import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.BASK_API_KEY;
const API_URL = process.env.BASK_API_URL ?? "https://api.bask.health/v1";

if (!API_KEY && process.env.NODE_ENV === "development") {
  console.warn("BASK_API_KEY is not set. Using mock data for development.");
} else if (API_KEY) {
  console.log("Bask API Key loaded:", API_KEY.substring(0, 4) + "...");
}

type ProxyOptions = {
  path: string;
  method: string;
  body?: any;
  authToken?: string; // JWT for patient operations
};

// Mock data for development when API key is not set
function getMockResponse(path: string, method: string, body?: any) {
  const correlationId = crypto.randomUUID();
  
  // Mock signup response
  if (path === "/auth/signup" && method === "POST") {
    return NextResponse.json({
      patient_id: "mock-patient-123",
      token: "mock-jwt-token-123",
      data: {
        id: "mock-patient-123",
        token: "mock-jwt-token-123"
      }
    }, {
      status: 200,
      headers: { "X-Client-Correlation-Id": correlationId },
    });
  }
  
  // Mock product groups response
  if (path.includes("/product-groups")) {
    return NextResponse.json({
      data: {
        productGroups: [
          { id: 1, name: "Semaglutide" },
          { id: 2, name: "Tirzepatide" }
        ]
      }
    }, {
      status: 200,
      headers: { "X-Client-Correlation-Id": correlationId },
    });
  }
  
  // Mock membership plans response
  if (path.includes("/membership-plans")) {
    return NextResponse.json({
      data: {
        membershipPlans: [
          {
            id: 991,
            name: "Semaglutide Plan",
            variants: [
              { id: 1, name: "Monthly", price: "$299.00" }
            ]
          },
          {
            id: 992,
            name: "Tirzepatide Plan",
            variants: [
              { id: 2, name: "Monthly", price: "$399.00" }
            ]
          }
        ]
      }
    }, {
      status: 200,
      headers: { "X-Client-Correlation-Id": correlationId },
    });
  }
  
  // Mock patient update response
  if (path === "/patients/me" && method === "PUT") {
    return NextResponse.json({
      success: true,
      message: "Patient updated successfully"
    }, {
      status: 200,
      headers: { "X-Client-Correlation-Id": correlationId },
    });
  }
  
  // Default mock response
  return NextResponse.json({
    success: true,
    message: "Mock response - API key not configured"
  }, {
    status: 200,
    headers: { "X-Client-Correlation-Id": correlationId },
  });
}

export async function forwardToBask(
  req: NextRequest,
  { path, method, body, authToken }: ProxyOptions
) {
  // Return mock data if API key is not set
  if (!API_KEY) {
    console.log(`[MOCK] ${method} ${path} - Returning mock data`);
    return getMockResponse(path, method, body);
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
