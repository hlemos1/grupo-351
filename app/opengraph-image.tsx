import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GRUPO +351 — Venture Builder Luso-Brasileiro";
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
          background: "linear-gradient(135deg, #0B1D32 0%, #132d4a 50%, #0B1D32 100%)",
          position: "relative",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* GRUPO label */}
        <div
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: 8,
            marginBottom: 20,
          }}
        >
          GRUPO
        </div>

        {/* +351 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Plus */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: 64,
              height: 64,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 52,
                height: 12,
                borderRadius: 6,
                background: "#E8713A",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: 12,
                height: 52,
                borderRadius: 6,
                background: "#E8713A",
              }}
            />
          </div>
          {/* 351 text */}
          <div
            style={{
              color: "white",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            351
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 6,
            marginTop: 32,
          }}
        >
          HUB DE NEGÓCIOS E JOINT VENTURES
        </div>

        {/* Location */}
        <div
          style={{
            color: "rgba(255,255,255,0.2)",
            fontSize: 14,
            letterSpacing: 2,
            marginTop: 16,
          }}
        >
          CASCAIS, PORTUGAL
        </div>

        {/* Accent line */}
        <div
          style={{
            width: 120,
            height: 2,
            borderRadius: 1,
            background: "rgba(232,113,58,0.4)",
            marginTop: 40,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
