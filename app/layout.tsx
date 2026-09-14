import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Outfit, Rozha_One, Noto_Sans_Devanagari } from "next/font/google";
import { GA_ID } from "@/lib/analytics";
import AdsterraGlobal from "@/components/Ads/AdsterraGlobal";
import "./globals.css";

/**
 * Fonts are self-hosted by next/font. Previously these came from an
 * @import inside globals.css, which blocks the first render on a round trip
 * to fonts.googleapis.com. Self-hosting removes that request entirely and
 * `display: swap` means text is readable immediately.
 */
/**
 * Two faces only.
 *
 * Rozha One is a heavy Devanagari display face — used for headings and
 * nothing else. Noto Sans Devanagari carries all UI and body text: it is
 * far more legible at small sizes than a serif, which matters most for
 * readers who are slow.
 */
const rozha = Rozha_One({
  subsets: ["latin", "devanagari"],
  weight: "400",
  variable: "--f-rozha",
  display: "swap",
});

const notoSansDev = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-noto-sans-dev",
  display: "swap",
});

/** Latin fallback so English and numerals don't drop to a system default. */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-outfit",
  display: "swap",
});

const SITE_URL = "https://ganpatibappa.online";
const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "गणपती बाप्पा मोरया | Ganesh Chaturthi 2026 Status & Card Maker",
    template: "%s | ganpatibappa.online",
  },
  description:
    "पावन गणेश चतुर्थी के लिए अपने नाम व फोटो के साथ सुंदर HD स्टेटस व ग्रीटिंग कार्ड बनाएं — पूरी तरह मुफ़्त, बिना लॉगिन। साथ में मुंबई के प्रमुख गणपति मंडल दर्शन गाइड और गणेश आरती संग्रह।",
  applicationName: "Bappa Blessings",
  keywords: [
    "Ganesh Chaturthi 2026",
    "Ganpati Bappa Morya",
    "Ganesh Status Card",
    "Ganesh Chaturthi Card Maker",
    "Ganpati Bappa Online",
    "Lalbaugcha Raja darshan",
    "Mumbai Ganpati mandals",
    "Ganesh Aarti",
    "गणेश चतुर्थी कार्ड",
    "गणपती बाप्पा मोरया",
  ],
  authors: [{ name: "Ganpati Bappa Online", url: SITE_URL }],
  creator: "Ganpati Bappa Online",
  alternates: { canonical: "/" },
  category: "Festival",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23E86A17'/><text y='.9em' font-size='80' x='10'>ॐ</text></svg>",
      },
    ],
    apple: "/images/ganesha_hero.jpg",
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: "Bappa Blessings",
    title: "गणेश चतुर्थी की हार्दिक शुभकामनाएं | अपना पावन कार्ड बनाएं",
    description:
      "बाप्पा के आशीर्वाद का सुंदर स्टेटस कार्ड अपने नाम व फोटो के साथ बनाएं और WhatsApp पर शेयर करें। पूरी तरह मुफ़्त।",
    images: [
      {
        url: "/images/ganesha_cinematic.jpg",
        width: 896,
        height: 1200,
        alt: "गणेश चतुर्थी पर सजी हुई भगवान गणेश की मूर्ति",
      },
    ],
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "गणेश चतुर्थी की हार्दिक शुभकामनाएं | ganpatibappa.online",
    description: "बाप्पा के आशीर्वाद का सुंदर स्टेटस कार्ड अपने नाम व फोटो के साथ बनाएं।",
    images: ["/images/ganesha_cinematic.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F4",
  width: "device-width",
  initialScale: 1,
  // Never cap zoom — pinch-to-zoom is an accessibility requirement.
  maximumScale: 5,
  userScalable: true,
};

/** Structured data so Google can show this as a rich result. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Bappa Blessings",
      inLanguage: "hi-IN",
      description:
        "Free Ganesh Chaturthi greeting and WhatsApp status card maker, Mumbai Ganpati mandal darshan guide and Ganesh aarti collection.",
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Ganesh Chaturthi Card Maker",
      url: SITE_URL,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@type": "Event",
      name: "Ganesh Chaturthi 2026",
      description:
        "Ganesh Chaturthi — the ten-day festival celebrating the birth of Lord Ganesha, observed most spectacularly in Mumbai.",
      startDate: "2026-09-14",
      endDate: "2026-09-24",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Mumbai, Maharashtra, India",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        },
      },
      image: [`${SITE_URL}/images/ganesha_cinematic.jpg`],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="hi"
      className={`${rozha.variable} ${notoSansDev.variable} ${outfit.variable}`}
    >
      <head>
        {/* Warm up the ad origins so the first ad call isn't paying for DNS + TLS. */}
        <link rel="preconnect" href="https://www.highrevenueformat.com" />
        <link rel="dns-prefetch" href="https://www.highrevenueformat.com" />
        <link rel="preconnect" href="https://pl31338409.profitableratecpmnetwork.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pl31338410.profitableratecpmnetwork.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pl31338411.profitableratecpmnetwork.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Google Analytics 4 — gtag.js */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname + window.location.search,
              send_page_view: true
            });
          `}
        </Script>

        {/* Google AdSense — only when a client id is configured. */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        <script
          type="application/ld+json"
          // Static, authored above — not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <a href="#main" className="skip-link">
          मुख्य सामग्री पर जाएं
        </a>

        {children}

        <AdsterraGlobal />
      </body>
    </html>
  );
}
