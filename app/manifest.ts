import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bappa Blessings — गणेश चतुर्थी कार्ड मेकर",
    short_name: "Bappa Blessings",
    description:
      "गणेश चतुर्थी के लिए अपने नाम व फोटो के साथ HD ग्रीटिंग कार्ड और WhatsApp स्टेटस बनाएं।",
    start_url: "/",
    display: "standalone",
    background_color: "#170A2B",
    theme_color: "#E86A17",
    lang: "hi",
    categories: ["lifestyle", "entertainment"],
    icons: [
      { src: "/icon", sizes: "48x48", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/images/ganesha_hero.jpg", sizes: "1024x1024", type: "image/jpeg", purpose: "any" },
    ],
  };
}
