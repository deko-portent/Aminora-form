import { NextRequest, NextResponse } from "next/server";
import { forwardToBask } from "../_utils";

export async function GET(req: NextRequest) {
  // We need to fetch both product groups and membership plans
  // Since forwardToBask returns a Response object, we can't easily compose them unless we refactor.
  // For now, I'll just expose two endpoints or handle it here manually.
  // Let's fetch both and combine them.

  // ACTUALLY, forwardToBask returns a Next response.
  // I'll just forward the membership-plans request for now as that likely contains the pricing.
  // But wait, the checkout needs productGroupId too.
  
  return forwardToBask(req, {
    path: "/membership-plans?includeInactive=false",
    method: "GET",
  });
}

