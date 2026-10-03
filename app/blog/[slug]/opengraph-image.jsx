import { getPost } from "../../../content";
import { ogCard, OG_SIZE } from "../../../lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "FindMyClients blog";

export default function Image({ params }) {
  const p = getPost(params.slug);
  return ogCard({ kicker: p?.category || "Blog", title: p?.title || "FindMyClients blog", subtitle: "findmyclients · free guides for freelancers & agencies" });
}
