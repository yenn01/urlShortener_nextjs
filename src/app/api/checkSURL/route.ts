import type { NextRequest, NextResponse } from "next/server";
import { useSearchParams } from "next/navigation";

import { getSURLS } from "@/firebase/firestore/db";
import { sha256 } from "js-sha256";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const url = form.get("longurl");
  const surls = await getSURLS(url as string);
  //console.log(surls);
  console.log("Final surls");
  console.log(surls);
  return Response.json({ surls: surls });
  //   res.status(200).json({ name: "John Doe" });
}
