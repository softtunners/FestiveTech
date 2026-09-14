import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bappa Blessings — गणेश चतुर्थी कार्ड मेकर",
    short_name: "Bappa Blessings",
    description:
      "गणेश चतुर्थी के लिए अपने नाम व फोटो के साथ HD ग्रीटिंग कार्ड और WhatsApp स्टेटस बनाएं।",
    start_url: "/",
    display: "standalone",
    background_color: "#080302",
    theme_color: "#1A0802",
    lang: "hi",
    categories: ["lifestyle", "entertainment"],
    icons: [
      { src: "/images/ganesha_hero.jpg", sizes: "1024x1024", type: "image/jpeg", purpose: "any" },
    ],
  };
}
