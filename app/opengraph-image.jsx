import { ImageResponse } from "next/og";
import { SITE } from "../lib/site";

export const alt = `${SITE.name} — free AI lead finder for freelancers and agencies`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 72, backgroundColor: "#0B0B0C", backgroundImage: "radial-gradient(circle at 85% 0%, rgba(231,178,76,0.25), rgba(11,11,12,0) 55%)", color: "#ECECEE" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, border: "2px solid #26262c", display: "flex", alignItems: "center", justifyContent: "center", color: "#E7B24C" }}><div style={{ width: 22, height: 22, borderRadius: 11, border: "4px solid #E7B24C" }} /></div>
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>Find clients who need you</div>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3, color: "#E7B24C" }}>right now.</div>
          <div style={{ fontSize: 30, color: "#8C8C95", marginTop: 28 }}>Free AI lead finder for freelancers & agencies · live web research · drafted outreach</div>
        </div>
      </div>
    ),
    size
  );
}
