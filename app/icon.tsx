import { ImageResponse } from "next/og";

export const size = {
  width: 48,
  height: 48,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: "linear-gradient(135deg, #FF6B00 0%, #C41E00 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "24%",
          color: "#FFFBEB",
          fontWeight: 700,
        }}
      >
        ॐ
      </div>
    ),
    {
      ...size,
    }
  );
}
