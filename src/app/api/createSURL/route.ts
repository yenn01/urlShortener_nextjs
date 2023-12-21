import type { NextRequest, NextResponse } from "next/server";
import { createShortURL } from "@/firebase/firestore/db";

export async function POST(req: NextRequest) {
  //   console.log(req);

  const form = await req.formData();
  const url = form.get("longurl");
  console.log("In api", url);
  await createShortURL(url as string, "None");
  return Response.json({ url: url });
  //   res.status(200).json({ name: "John Doe" });
}
