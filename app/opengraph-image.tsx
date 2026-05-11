import { ImageResponse } from "next/og";

export const alt = "dearteenlinea × qullqa";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8f7f4",
          color: "#171717",
          padding: "76px 84px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #d9d5cc",
            paddingBottom: "32px",
            fontSize: 28,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          <span>Galería curada</span>
          <span>Obras públicas</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              letterSpacing: -2,
              fontWeight: 500,
            }}
          >
            dearteenlinea × qullqa
          </div>
          <div
            style={{
              maxWidth: 860,
              fontSize: 34,
              lineHeight: 1.28,
              color: "#56524b",
            }}
          >
            Arte moderno y contemporáneo, obras curadas y un espacio público
            para artistas.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 26,
            color: "#737067",
          }}
        >
          dearteenlinea.com
        </div>
      </div>
    ),
    size,
  );
}
