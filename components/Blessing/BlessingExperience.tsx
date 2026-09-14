"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  generateBlessingCard,
  CardFormat,
  CardFrame,
  GREETING_PRESETS,
} from "@/lib/cardGenerator";

interface BlessingExperienceProps {
  initialName?: string;
  fromName?: string;
}

export default function BlessingExperience({
  initialName = "",
}: BlessingExperienceProps) {
  const [senderName, setSenderName] = useState(initialName);
  const [selectedPresetId, setSelectedPresetId] = useState("blessing-1");
  const [customMessage, setCustomMessage] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [format, setFormat] = useState<CardFormat>("square");
  const [frame, setFrame] = useState<CardFrame>("temple-arch");
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active message & shloka
  const activePreset =
    GREETING_PRESETS.find((p) => p.id === selectedPresetId) || GREETING_PRESETS[0];
  const activeMessage = isCustom ? customMessage || activePreset.text : activePreset.text;
  const activeShloka = activePreset.shloka;

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3400);
  }, []);

  // Card rendering function using pure React state
  const renderCard = useCallback(async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateBlessingCard({
        senderName,
        blessingMessage: activeMessage,
        shloka: activeShloka,
        closing: "गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!",
        userPhotoDataUrl: userPhotoUrl,
        format,
        frame,
      });

      canvasRef.current = canvas;
      setCardDataUrl(canvas.toDataURL("image/png"));
    } catch (e) {
      console.error("Error generating card:", e);
    } finally {
      setIsGenerating(false);
    }
  }, [senderName, activeMessage, activeShloka, userPhotoUrl, format, frame]);

  // Re-render when options change
  useEffect(() => {
    const timer = setTimeout(() => {
      renderCard();
    }, 150);
    return () => clearTimeout(timer);
  }, [renderCard]);

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setUserPhotoUrl(url);
      showToast("फोटो सफलतापूर्वक जोड़ी गई!");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setUserPhotoUrl(null);
    setPhotoFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("फोटो हटा दी गई।");
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "https://ganpatibappa.online";
    return window.location.origin;
  };

  // Download card as PNG
  const handleDownload = () => {
    if (!cardDataUrl) {
      showToast("कार्ड तैयार हो रहा है...");
      return;
    }
    try {
      const link = document.createElement("a");
      const safeName = senderName.trim()
        ? senderName.trim().replace(/\s+/g, "-")
        : "ganesh-utsav";
      link.download = `bappa-${format}-${safeName}.png`;
      link.href = cardDataUrl;
      link.click();
      showToast("HD कार्ड डाउनलोड हो गया!");
    } catch {
      showToast("कृपया स्क्रीनशॉट लेकर सेव करें।");
    }
  };

  // Share to WhatsApp
  const handleWhatsApp = () => {
    const shareUrl = getShareUrl();
    const sender = senderName.trim() ? `\n- *${senderName.trim()}*\n` : "";
    const msg = `🌺 *गणेश चतुर्थी की हार्दिक शुभकामनाएं!* 🙏\n\n${activeMessage}\n\n*गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!*${sender}\n\n✨ आप भी अपने नाम और फोटो का सुंदर स्टेटस कार्ड बनाएं:\n👉 ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
    showToast("WhatsApp खुल रहा है...");
  };

  // Web Share API (shares actual image file if supported)
  const handleNativeShare = async () => {
    const shareUrl = getShareUrl();
    const title = "गणेश चतुर्थी की हार्दिक शुभकामनाएं";
    const text = `🌺 गणपती बाप्पा मोरया! आपके लिए पावन आशीर्वाद कार्ड:\n👉 ${shareUrl}`;

    if (navigator.share) {
      try {
        if (canvasRef.current && navigator.canShare) {
          const blob = await new Promise<Blob>((res) =>
            canvasRef.current!.toBlob((b) => res(b!), "image/png")
          );
          const file = new File([blob], `bappa-card.png`, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ title, text, files: [file] });
            showToast("सफलतापूर्वक शेयर किया गया!");
            return;
          }
        }
        await navigator.share({ title, text, url: shareUrl });
        showToast("शेयर किया गया!");
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") handleDownload();
      }
    } else {
      handleDownload();
    }
  };

  return (
    <section id="card-creator" className="section" style={{ scrollMarginTop: "70px" }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="hero-eyebrow" style={{ justifyContent: "center", marginBottom: 12 }}>
            <TempleMiniIcon />
            <span>पावन उत्सव पोस्ट एवं स्टेटस क्रिएटर</span>
          </div>
          <h2 className="section-title">अपना पावन बाप्पा कार्ड व स्टेटस बनाएं</h2>
          <p className="section-sub">
            फ्रेम चुनें, अपना संदेश व नाम जोड़ें और WhatsApp Status व मित्रों के लिए HD कार्ड डाउनलोड करें।
          </p>
        </div>

        {/* Two-Column Grid: Left Controls, Right Live Card Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 32,
            alignItems: "start",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {/* LEFT: Controls Panel */}
          <div className="glass-card" style={{ padding: "28px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.25rem",
                color: "var(--brown-deep)",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <SettingsIcon /> कार्ड अनुकूलित करें (Customize)
            </h3>

            {/* 1. Format Toggle */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "var(--brown-mid)",
                  marginBottom: 8,
                }}
              >
                कार्ड फॉर्मेट (Format)
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setFormat("square")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: format === "square" ? "2px solid var(--bhagwa)" : "1.5px solid #E5E7EB",
                    background: format === "square" ? "var(--amber-light)" : "#FFFFFF",
                    color: format === "square" ? "var(--bhagwa-deep)" : "#4B5563",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  WhatsApp Chat (1:1)
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("story")}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: format === "story" ? "2px solid var(--bhagwa)" : "1.5px solid #E5E7EB",
                    background: format === "story" ? "var(--amber-light)" : "#FFFFFF",
                    color: format === "story" ? "var(--bhagwa-deep)" : "#4B5563",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  WhatsApp Status (9:16)
                </button>
              </div>
            </div>

            {/* 2. Frame Style Selector */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "var(--brown-mid)",
                  marginBottom: 8,
                }}
              >
                फ्रेम स्टाइल (Choose Frame)
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { id: "temple-arch" as CardFrame, title: "स्वर्ण तोरण", desc: "Temple Gold" },
                  { id: "marigold" as CardFrame, title: "गेंदा पुष्प", desc: "Marigold" },
                  { id: "royal-velvet" as CardFrame, title: "दीप उत्सव", desc: "Royal Velvet" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrame(f.id)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 12,
                      border: frame === f.id ? "2px solid var(--bhagwa)" : "1.5px solid #E5E7EB",
                      background: frame === f.id ? "var(--amber-light)" : "#FFFFFF",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        color: frame === f.id ? "var(--bhagwa-deep)" : "#1F2937",
                      }}
                    >
                      {f.title}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#6B7280", marginTop: 2 }}>
                      {f.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Greeting Message Preset */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "var(--brown-mid)",
                  marginBottom: 8,
                }}
              >
                शुभकामना संदेश (Blessing Message)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {GREETING_PRESETS.map((p) => {
                  const isSelected = !isCustom && selectedPresetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPresetId(p.id);
                        setIsCustom(false);
                      }}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: isSelected ? "2px solid var(--bhagwa)" : "1.5px solid #E5E7EB",
                        background: isSelected ? "var(--amber-light)" : "#FAFAFA",
                        cursor: "pointer",
                        transition: "all 0.18s",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          color: isSelected ? "var(--bhagwa-deep)" : "#1F2937",
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "#6B7280",
                          marginTop: 3,
                          lineHeight: 1.4,
                        }}
                      >
                        {p.text}
                      </div>
                    </div>
                  );
                })}

                {/* Custom text button */}
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: isCustom ? "2px solid var(--bhagwa)" : "1.5px dashed #D1D5DB",
                    background: isCustom ? "var(--amber-light)" : "transparent",
                    color: isCustom ? "var(--bhagwa-deep)" : "#4B5563",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  + अपना खुद का संदेश लिखें (Write custom)
                </button>

                {isCustom && (
                  <textarea
                    rows={3}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="अपना पावन संदेश यहाँ लिखें..."
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 10,
                      border: "1.5px solid var(--bhagwa)",
                      fontSize: "0.88rem",
                      fontFamily: "var(--font-body)",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                )}
              </div>
            </div>

            {/* 4. Sender Name (Optional) */}
            <div style={{ marginBottom: 22 }}>
              <label
                htmlFor="sender-name-input"
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "var(--brown-mid)",
                  marginBottom: 6,
                }}
              >
                आपका नाम / परिवार का नाम (वैकल्पिक)
              </label>
              <input
                id="sender-name-input"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="उदा: राहुल शर्मा / शर्मा परिवार"
                maxLength={40}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #D1D5DB",
                  background: "#FFFFFF",
                  fontSize: "0.94rem",
                  fontFamily: "var(--font-heading)",
                  outline: "none",
                }}
              />
              <p style={{ fontSize: "0.76rem", color: "#6B7280", marginTop: 5 }}>
                कार्ड के नीचे &quot;शुभेच्छुक: {senderName || "आपका नाम"}&quot; लिखा आएगा। खाली रखने पर मंत्र दिखेगा।
              </p>
            </div>

            {/* 5. User Photo Upload (Optional) */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "0.92rem",
                  color: "var(--brown-mid)",
                  marginBottom: 6,
                }}
              >
                अपनी फोटो जोड़ें (वैकल्पिक)
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 12,
                    border: "1.5px solid var(--bhagwa)",
                    background: "#FFFFFF",
                    color: "var(--bhagwa-deep)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <CameraMiniIcon />
                  {photoFileName ? "फोटो बदलें" : "फोटो चुनें"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
                {userPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1px solid #EF4444",
                      background: "#FEF2F2",
                      color: "#DC2626",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    हटाएं
                  </button>
                )}
              </div>
              <p style={{ fontSize: "0.76rem", color: "#6B7280", marginTop: 5 }}>
                कार्ड के नीचे आपके नाम के साथ सुनहरे घेरे (Golden Frame) में आपकी फोटो जुड़ेगी।
              </p>
            </div>
          </div>

          {/* RIGHT: Live Preview & Instant Share Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                position: "relative",
                background: "#0C0A09",
                padding: "20px",
                borderRadius: "24px",
                border: "1px solid rgba(245,158,11,0.2)",
                boxShadow: "0 20px 48px rgba(0,0,0,0.25)",
              }}
            >
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 18,
                  background: "rgba(245,158,11,0.2)",
                  border: "1px solid rgba(245,158,11,0.4)",
                  color: "#FDE68A",
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: "0.74rem",
                  fontWeight: 600,
                  zIndex: 2,
                }}
              >
                {format === "square" ? "1:1 Chat Post" : "9:16 Full Screen Status"}
              </div>

              {/* Card Display */}
              <div
                style={{
                  minHeight: format === "story" ? 420 : 340,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cardDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cardDataUrl}
                    alt="पावन बाप्पा ग्रीटिंग कार्ड"
                    style={{
                      maxWidth: "100%",
                      maxHeight: format === "story" ? "520px" : "440px",
                      height: "auto",
                      borderRadius: "18px",
                      display: "block",
                      margin: "0 auto",
                      boxShadow:
                        "0 18px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(245,158,11,0.25)",
                    }}
                  />
                ) : (
                  <div style={{ color: "#FDE68A", fontSize: "0.95rem" }}>
                    {isGenerating ? "कार्ड तैयार हो रहा है..." : "कार्ड लोड हो रहा है..."}
                  </div>
                )}
              </div>
            </div>

            {/* 3D Action Buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                type="button"
                onClick={handleDownload}
                className="btn-3d"
                style={{
                  background: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
                  boxShadow: "0 4px 0 #047857, 0 8px 18px rgba(16,185,129,0.35)",
                  color: "#FFFFFF",
                  padding: "14px 18px",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <DownloadMiniIcon />
                HD डाउनलोड करें
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="btn-3d"
                style={{
                  background: "linear-gradient(180deg, #25D366 0%, #128C7E 100%)",
                  boxShadow: "0 4px 0 #075E54, 0 8px 18px rgba(37,211,102,0.35)",
                  color: "#FFFFFF",
                  padding: "14px 18px",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <WhatsAppMiniIcon />
                WhatsApp शेयर
              </button>
            </div>

            {/* Secondary Share Action */}
            <button
              type="button"
              onClick={handleNativeShare}
              style={{
                background: "transparent",
                border: "1.5px solid var(--bhagwa)",
                color: "var(--bhagwa-deep)",
                padding: "11px 18px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.18s",
              }}
            >
              <ShareMiniIcon />
              अन्य ऐप्स पर शेयर करें (Instagram / Facebook)
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastVisible && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1C1917",
            color: "#FFFBEB",
            border: "1px solid var(--bhagwa)",
            padding: "12px 24px",
            borderRadius: 30,
            fontSize: "0.92rem",
            fontWeight: 600,
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          {toastMsg}
        </div>
      )}
    </section>
  );
}

function TempleMiniIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bhagwa)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V11a3 3 0 0 1 6 0v10" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--bhagwa-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function CameraMiniIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function DownloadMiniIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}
function WhatsAppMiniIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
    </svg>
  );
}
function ShareMiniIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
