import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function Icon({ size }: { size: number }) {
  const plus = size * 0.28;
  const bar = size * 0.06;
  const radius = bar / 2;
  const fontSize = size * 0.32;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0B1D32 0%, #152d4a 100%)",
        borderRadius: size * 0.18,
      }}
    >
      {/* Plus */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: plus,
          height: plus,
          marginBottom: size * 0.02,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: plus,
            height: bar,
            borderRadius: radius,
            background: "#E8713A",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: bar,
            height: plus,
            borderRadius: radius,
            background: "#E8713A",
          }}
        />
      </div>
      {/* 351 */}
      <div
        style={{
          color: "white",
          fontSize,
          fontWeight: 800,
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        351
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const size = Number(searchParams.get("size")) || 512;
  const clamped = Math.min(Math.max(size, 48), 1024);

  return new ImageResponse(<Icon size={clamped} />, {
    width: clamped,
    height: clamped,
  });
}
