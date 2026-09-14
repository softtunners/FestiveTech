import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-JTDZYPYW55";
const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  title: "गणपती बाप्पा मोरया | Ganesh Chaturthi 2026 Status & Card Maker",
  description:
    "पावन गणेश चतुर्थी के लिए अपने नाम व फोटो के साथ सुंदर HD स्टेटस व ग्रीटिंग कार्ड बनाएं। परिवार और मित्रों के साथ WhatsApp पर शेयर करें।",
  keywords: [
    "Ganesh Chaturthi 2026",
    "Ganpati Bappa Morya",
    "Ganesh Status Card",
    "Ganesh Chaturthi Card Maker",
    "Ganpati Bappa Online",
    "गणेश चतुर्थी कार्ड",
  ],
  authors: [{ name: "Ganpati Bappa Online" }],
  metadataBase: new URL("https://ganpatibappa.online"),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23E86A17'/><text y='.9em' font-size='80' x='10'>ॐ</text></svg>",
  },
  openGraph: {
    type: "website",
    title: "गणेश चतुर्थी की हार्दिक शुभकामनाएं | अपना पावन कार्ड बनाएं",
    description:
      "बाप्पा के आशीर्वाद का सुंदर स्टेटस कार्ड अपने नाम व फोटो के साथ बनाएं और WhatsApp पर शेयर करें।",
    images: ["/images/ganesha_cinematic.jpg"],
    url: "https://ganpatibappa.online/",
  },
  twitter: {
    card: "summary_large_image",
    title: "गणेश चतुर्थी की हार्दिक शुभकामनाएं | ganpatibappa.online",
    description: "बाप्पा के आशीर्वाद का सुंदर स्टेटस कार्ड अपने नाम व फोटो के साथ बनाएं।",
    images: ["/images/ganesha_cinematic.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A0802",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Google AdSense Auto Ads (when configured) */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {children}
      </body>
    </html>
  );
}
