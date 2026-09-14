import { ImageResponse } from "next/og";

export const alt = "गणेश चतुर्थी की हार्दिक शुभकामनाएं | ganpatibappa.online";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          background: "radial-gradient(circle at center, #2C0F45 0%, #150624 70%, #0D0218 100%)",
          border: "12px solid #E86A17",
          padding: "40px",
          position: "relative",
        }}
      >
        {/* Decorative corner accent */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 32,
            color: "#FFA000",
            fontSize: 28,
            fontWeight: "bold",
            letterSpacing: 2,
          }}
        >
          🕉️ ॐ गं गणपतये नमः
        </div>

        <div
          style={{
            position: "absolute",
            top: 24,
            right: 32,
            color: "#FFA000",
            fontSize: 24,
            fontWeight: 600,
            background: "rgba(232, 106, 23, 0.2)",
            padding: "6px 18px",
            borderRadius: 20,
            border: "1px solid #E86A17",
          }}
        >
          ganpatibappa.online
        </div>

        {/* Central Symbol & Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B00 0%, #C41E00 100%)",
            color: "#FFF8E7",
            fontSize: 68,
            boxShadow: "0 0 40px rgba(255, 107, 0, 0.6)",
            marginBottom: 20,
          }}
        >
          ॐ
        </div>

        <div
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: "#FFD54F",
            textAlign: "center",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            marginBottom: 12,
          }}
        >
          गणपती बाप्पा मोरया!
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Ganesh Chaturthi 2026 Special Status & Greeting Maker
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "linear-gradient(90deg, #E86A17 0%, #FF8F00 100%)",
            color: "#1A0802",
            padding: "12px 32px",
            borderRadius: 30,
            fontSize: 24,
            fontWeight: "bold",
            boxShadow: "0 4px 16px rgba(232, 106, 23, 0.4)",
          }}
        >
          ✨ अपने नाम व फोटो के साथ फ्री स्टेटस कार्ड बनाएं ✨
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
