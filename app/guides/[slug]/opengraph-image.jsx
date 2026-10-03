import { getGuide } from "../../../content";
import { ogCard, OG_SIZE } from "../../../lib/og";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "FindMyClients guide";

export default function Image({ params }) {
  const g = getGuide(params.slug);
  return ogCard({ kicker: "Guide", title: g?.title || "FindMyClients guide", subtitle: "findmyclients · free guides for freelancers & agencies" });
}
