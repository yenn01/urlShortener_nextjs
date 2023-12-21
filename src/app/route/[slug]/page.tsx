import { redirect } from "next/navigation";
import { redirectURL } from "@/firebase/firestore/db";

type foundURL = {
  url: string;
  stats: {
    clicks: number;
  };
  created_at: number;
  owner: string;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const data: foundURL | undefined = (await redirectURL(
    params.slug
  )) as foundURL;
  if (data === undefined) {
    console.log("undefined");
  } else {
    redirect("https://" + data.url);
  }
  //   permanentRedirect("/" + params.slug);
}
