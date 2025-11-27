import { NextRequest } from "next/server";
import { forwardToBask } from "../_utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  // The docs specify /auth/signup for creating a new patient account + token
  return forwardToBask(req, {
    path: "/auth/signup",
    method: "POST",
    body,
  });
}
