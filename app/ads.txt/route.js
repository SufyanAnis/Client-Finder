// /ads.txt — authorizes Google to sell ads on this site. Generated from the
// AdSense publisher id so it can't drift from the ad code.
import { ADS } from "../../lib/site";

export const dynamic = "force-static";

export function GET() {
  const pub = ADS.client.replace(/^ca-/, "");
  const body = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "# AdSense not configured yet\n";
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
