import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KI-Coaching Kompass · Bernd Wiese";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0ebe2",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* Top gold bar */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "5px",
            background: "#8c6820",
            display: "flex",
          }}
        />

        {/* Subtle orb */}
        <div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: "700px", height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(180,130,50,0.12) 0%, transparent 65%)",
            transform: "translate(-50%, -55%)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px",
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "16px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#8c6820",
            }}
          >
            <div style={{ width: "36px", height: "1px", background: "#8c6820", display: "flex" }} />
            KI-Coaching Kompass
            <div style={{ width: "36px", height: "1px", background: "#8c6820", display: "flex" }} />
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 300,
              color: "#1c1916",
              lineHeight: 1.1,
              textAlign: "center",
              maxWidth: "900px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            KI verändert, wie wir uns begegnen.
          </div>

          {/* Sub */}
          <div
            style={{
              fontSize: "26px",
              color: "#6b5f54",
              fontWeight: 300,
              textAlign: "center",
              lineHeight: 1.5,
              display: "flex",
            }}
          >
            Beratung · Workshop · Begleitung
          </div>
        </div>

        {/* Author line */}
        <div
          style={{
            position: "absolute",
            bottom: "52px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "15px",
            color: "#8c6820",
            letterSpacing: "0.1em",
          }}
        >
          <span>Bernd Wiese</span>
          <span style={{ color: "#c5b89a" }}>·</span>
          <span>Staufen</span>
          <span style={{ color: "#c5b89a" }}>·</span>
          <span>ki-coaching-kompass.vercel.app</span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "3px",
            background: "rgba(140,104,32,0.25)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
