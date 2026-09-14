"use client";

interface AdBannerProps {
  size?: "leaderboard" | "rectangle" | "responsive";
  label?: string;
}

export default function AdBanner({ size = "leaderboard", label = "Advertisement" }: AdBannerProps) {
  return (
    <div className="ad-zone">
      <div className={`ad-inner ${size === "rectangle" ? "ad-rectangle" : "ad-leaderboard"}`}>
        <div className="ad-label-text">{label}</div>
        <div className="ad-content">
          {size === "rectangle"
            ? "[ 300 x 250 Display Ad — Google AdSense Ready ]"
            : "[ Responsive Banner Ad — Google AdSense Ready ]"}
        </div>
      </div>
    </div>
  );
}
