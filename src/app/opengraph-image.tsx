import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f4f7fb",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "#1e4fa3",
            opacity: 0.12,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: 120,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "#e2662e",
            opacity: 0.12,
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#1e4fa3",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 700, color: "#172033", display: "flex" }}>
            Santa Fe <span style={{ color: "#1e4fa3", marginLeft: 10 }}>Schools</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#172033",
            maxWidth: 950,
            display: "flex",
          }}
        >
          Jardines, escuelas, terciarios y universidades de Santa Fe
        </div>
        <div style={{ marginTop: 28, fontSize: 26, color: "#5b6b85", display: "flex" }}>
          Gestión, orientación, carreras y contacto — en un solo lugar
        </div>
      </div>
    ),
    { ...size }
  );
}
