// Shared social-card renderer: the site-wide card and per-article cards with the title.
import { ImageResponse } from "next/og";
import { SITE } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

export function ogCard({ kicker, title, subtitle }) {
  const size = title.length > 70 ? 58 : title.length > 45 ? 68 : 80;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: 72, backgroundColor: "#0B0B0C", backgroundImage: "radial-gradient(circle at 85% 0%, rgba(231,178,76,0.25), rgba(11,11,12,0) 55%)", color: "#ECECEE" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, border: "2px solid #26262c", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, border: "4px solid #E7B24C" }} />
          </div>
          {SITE.name}
          {kicker ? <div style={{ marginLeft: 18, fontSize: 24, color: "#E7B24C", textTransform: "uppercase", letterSpacing: 3 }}>{kicker}</div> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          {subtitle ? <div style={{ fontSize: 28, color: "#8C8C95", marginTop: 26 }}>{subtitle}</div> : null}
        </div>
      </div>
    ),
    OG_SIZE
  );
}
