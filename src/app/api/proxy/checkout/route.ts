import { NextRequest, NextResponse } from "next/server";
import { forwardToBask } from "../_utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { authToken, productGroupId, membershipPlanId } = body || {};

  if (!authToken) {
    return NextResponse.json(
      { error: "authToken is required for checkout" },
      { status: 401 }
    );
  }

  if (!productGroupId || !membershipPlanId) {
    return NextResponse.json(
      { error: "productGroupId and membershipPlanId are required" },
      { status: 400 }
    );
  }

  return forwardToBask(req, {
    path: "/initiate-checkout",
    method: "POST",
    body: {
      productGroupId,
      membershipPlanId,
    },
    authToken,
  });
}
