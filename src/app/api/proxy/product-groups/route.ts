import { NextRequest } from "next/server";
import { forwardToBask } from "../_utils";

export async function GET(req: NextRequest) {
  return forwardToBask(req, {
    path: "/product-groups?includeArchived=false",
    method: "GET",
  });
}

