import { ImageResponse } from "next/og";
import { siteIdentity, seo } from "@/data/site";

/**
 * Social preview card.
 *
 * Generated rather than shipped as a static asset so it can never drift
 * from the identity data — if the name, roles or palette change, the
 * preview changes with them instead of going stale in `public/`.
 *
 * Composition is an editorial masthead rather than a gradient-and-glow
 * card: name set large in the display face, roles as technical metadata,
 * and the same track-chevron geometry the site icon uses, so the card is
 * recognisably the same artefact as the favicon and the hero.
 */

export const alt = seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0b0d",
          padding: 72,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* registration marks */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 48,
            width: 28,
            height: 28,
            borderTop: "3px solid #2b2e35",
            borderLeft: "3px solid #2b2e35",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 48,
            width: 28,
            height: 28,
            borderTop: "3px solid #2b2e35",
            borderRight: "3px solid #2b2e35",
          }}
        />

        {/* identity */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#f1f2f4",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {siteIdentity.name}
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
            {siteIdentity.primaryRole.map((role) => (
              <div
                key={role}
                style={{
                  fontSize: 38,
                  color: "#b8bbc2",
                  letterSpacing: "0.02em",
                  lineHeight: 1.35,
                }}
              >
                {role}
              </div>
            ))}
          </div>
        </div>

        {/* supporting statement + trace */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 48,
          }}
        >
          <div style={{ fontSize: 26, color: "#8b8f98", maxWidth: 620, lineHeight: 1.45 }}>
            {siteIdentity.supportingStatement}
          </div>

          {/* signature track chevron, in the accent */}
          <svg width="300" height="90" viewBox="0 0 300 90">
            <path
              d="M4 66c26 0 26-44 52-44s26 44 52 44 26-44 52-44 52 44 78 44"
              fill="none"
              stroke="#ff7a18"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    ),
    size
  );
}