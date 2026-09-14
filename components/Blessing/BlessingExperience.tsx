"use client";

import { useState, useRef, useCallback, useEffect, useImperativeHandle } from "react";
import { generateBlessingCard, CardFormat, CardFrame, GREETING_PRESETS } from "@/lib/cardGenerator";
import { analytics } from "@/lib/analytics";
import {
  WhatsAppIcon, DownloadIcon, ShareIcon, CameraIcon, CopyIcon, TempleIcon,
} from "@/components/icons";

export interface BlessingHandle {
  /** Share straight to WhatsApp — driven by the hero / nav / floating buttons. */
  shareWhatsApp: () => void;
}

interface BlessingExperienceProps {
  initialName?: string;
  ref?: React.Ref<BlessingHandle>;
}

const FORMATS: { id: CardFormat; name: string; sub: string; shape: string }[] = [
  { id: "square", name: "चैट में", sub: "चौकोर", shape: "square" },
  { id: "story", name: "स्टेटस में", sub: "लंबा", shape: "story" },
];

const FRAMES: { id: CardFrame; name: string }[] = [
  { id: "temple-arch", name: "सुनहरा" },
  { id: "marigold", name: "गेंदा" },
  { id: "royal-velvet", name: "लाल" },
  { id: "peacock", name: "मोरपंखी" },
  { id: "violet", name: "बैंगनी" },
];

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

export default function BlessingExperience({ initialName = "", ref }: BlessingExperienceProps) {
  const [senderName, setSenderName] = useState(initialName);
  const [presetId, setPresetId] = useState("blessing-1");
  const [customMessage, setCustomMessage] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [format, setFormat] = useState<CardFormat>("square");
  const [frame, setFrame] = useState<CardFrame>("temple-arch");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [isGenerating, setIsGenerating] = useState(true);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preset = GREETING_PRESETS.find((p) => p.id === presetId) || GREETING_PRESETS[0];
  const message = isCustom ? customMessage || preset.text : preset.text;

  const say = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }, []);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const renderCard = useCallback(async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateBlessingCard({
        senderName,
        blessingMessage: message,
        shloka: preset.shloka,
        closing: "गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!",
        userPhotoDataUrl: photoUrl,
        format,
        frame,
      });
      canvasRef.current = canvas;
      setCardDataUrl(canvas.toDataURL("image/png"));
    } catch (e) {
      console.error("card render failed:", e);
      say("कार्ड नहीं बन पाया। फिर कोशिश करें।");
    } finally {
      setIsGenerating(false);
    }
  }, [senderName, message, preset.shloka, photoUrl, format, frame, say]);

  useEffect(() => {
    const t = setTimeout(renderCard, 180);
    return () => clearTimeout(t);
  }, [renderCard]);

  const shareUrl = () =>
    typeof window === "undefined" ? "https://ganpatibappa.online" : window.location.origin;

  const shareText = useCallback(() => {
    const from = senderName.trim() ? `\n— *${senderName.trim()}*\n` : "";
    return `🌺 *गणेश चतुर्थी की हार्दिक शुभकामनाएं!* 🙏\n\n${message}\n\n*गणपती बाप्पा मोरया!*${from}\n\n✨ आप भी अपना कार्ड बनाएं:\n👉 ${shareUrl()}`;
  }, [senderName, message]);

  const download = useCallback(() => {
    if (!cardDataUrl) { say("कार्ड बन रहा है…"); return; }
    const a = document.createElement("a");
    const safe = senderName.trim() ? senderName.trim().replace(/\s+/g, "-") : "ganesh";
    a.download = `bappa-${format}-${safe}.png`;
    a.href = cardDataUrl;
    a.click();
    say("कार्ड सेव हो गया! ✅");
    analytics.cardDownloaded(format, frame, Boolean(photoUrl));
  }, [cardDataUrl, senderName, format, frame, photoUrl, say]);

  /**
   * One WhatsApp path for the whole site.
   *
   * Tries to share the actual image first — that is what people expect when
   * they say "send on WhatsApp". Only falls back to a text+link share when
   * the browser refuses files.
   */
  const shareWhatsApp = useCallback(async () => {
    analytics.cardShared("whatsapp", format);

    if (canvasRef.current && navigator.share && navigator.canShare) {
      try {
        const blob = await new Promise<Blob | null>((res) =>
          canvasRef.current!.toBlob((b) => res(b), "image/png"),
        );
        if (blob) {
          const file = new File([blob], "bappa-card.png", { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ text: shareText(), files: [file] });
            say("भेज दिया! 🙏");
            return;
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        // Fall through to the link share below.
      }
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText())}`, "_blank");
    say("WhatsApp खुल रहा है…");
  }, [format, shareText, say]);

  useImperativeHandle(ref, () => ({ shareWhatsApp }), [shareWhatsApp]);

  const shareOther = async () => {
    if (!navigator.share) { download(); return; }
    try {
      await navigator.share({ text: shareText(), url: shareUrl() });
      analytics.cardShared("native", format);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") download();
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText());
      say("कॉपी हो गया! ✅");
      analytics.cardShared("copy_link", format);
    } catch {
      say("कॉपी नहीं हुआ।");
    }
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { say("फोटो ही चुनें।"); return; }
    if (file.size > MAX_PHOTO_BYTES) { say("फोटो बहुत बड़ी है (8 MB तक)।"); return; }

    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target?.result as string);
      say("फोटो लग गई! ✅");
      analytics.photoAdded();
    };
    reader.onerror = () => say("फोटो नहीं खुली।");
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    setPhotoName("");
    if (fileRef.current) fileRef.current.value = "";
    say("फोटो हटा दी।");
  };

  return (
    <section id="card" className="section section--paper" style={{ scrollMarginTop: 78 }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow eyebrow--saffron"><TempleIconWrap /> कार्ड बनाएं</span>
          <h2 className="section-title">अपना कार्ड बनाकर भेजें</h2>
          <p className="section-sub">नीचे चुनते जाएं — कार्ड अपने आप बनता जाएगा।</p>
        </div>

        <div className="maker-grid">
          {/* ---------------- Steps ---------------- */}
          <div className="panel">
            <Step n={1} label="कहाँ भेजना है?">
              <div className="pick-grid pick-grid--2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="pick"
                    aria-pressed={format === f.id}
                    onClick={() => { setFormat(f.id); analytics.cardCustomised("format", f.id); }}
                  >
                    <span className={`shape shape--${f.shape}`} aria-hidden="true" />
                    <span className="pick-name">{f.name}</span>
                    <span className="pick-sub">{f.sub}</span>
                  </button>
                ))}
              </div>
            </Step>

            <Step n={2} label="कौन सा रंग?">
              <div className="pick-grid pick-grid--3">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="pick"
                    aria-pressed={frame === f.id}
                    onClick={() => { setFrame(f.id); analytics.cardCustomised("frame", f.id); }}
                  >
                    <span className={`swatch swatch--${f.id}`} aria-hidden="true" />
                    <span className="pick-name">{f.name}</span>
                  </button>
                ))}
              </div>
            </Step>

            <Step n={3} label="क्या लिखा हो?">
              <div className="pick-grid" role="radiogroup" aria-label="संदेश">
                {GREETING_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    className="pick msg-pick"
                    aria-checked={!isCustom && presetId === p.id}
                    onClick={() => { setPresetId(p.id); setIsCustom(false); analytics.cardCustomised("message", p.id); }}
                  >
                    <span className="pick-name">{p.title}</span>
                    <span className="msg-body">{p.text}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="pick"
                  aria-pressed={isCustom}
                  onClick={() => setIsCustom(true)}
                >
                  <span className="pick-name">✍️ खुद लिखें</span>
                </button>
                {isCustom && (
                  <textarea
                    className="textarea"
                    rows={3}
                    maxLength={220}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="यहाँ लिखें…"
                    aria-label="अपना संदेश"
                  />
                )}
              </div>
            </Step>

            <Step n={4} label="आपका नाम">
              <input
                className="input"
                type="text"
                value={senderName}
                maxLength={40}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="जैसे: राहुल शर्मा"
                aria-label="आपका नाम"
              />
              <p className="step-hint">कार्ड पर नीचे आपका नाम आएगा। न चाहें तो खाली छोड़ दें।</p>
            </Step>

            <Step n={5} label="अपनी फोटो (चाहें तो)">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="button" className="btn btn--ghost" onClick={() => fileRef.current?.click()}>
                  <CameraIcon />
                  {photoName ? "बदलें" : "फोटो लगाएं"}
                </button>
                {photoUrl && (
                  <button type="button" className="btn btn--ghost" onClick={removePhoto}>
                    हटाएं
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onPhoto}
                style={{ display: "none" }}
                aria-label="फोटो चुनें"
              />
              <p className="step-hint">🔒 फोटो फ़ोन से बाहर नहीं जाती।</p>
            </Step>
          </div>

          {/* ---------------- Preview + actions ---------------- */}
          <div className="preview-col">
            <div className="preview-frame">
              <span className="preview-tag">{format === "square" ? "चैट" : "स्टेटस"}</span>
              <div className="preview-body" style={{ minHeight: format === "story" ? 380 : 300 }}>
                {cardDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cardDataUrl}
                    alt="आपका तैयार कार्ड"
                    className="preview-img"
                    style={{
                      maxHeight: format === "story" ? 480 : 380,
                      opacity: isGenerating ? 0.55 : 1,
                      transition: "opacity 0.2s",
                    }}
                  />
                ) : (
                  <div
                    className="preview-skel"
                    style={{ aspectRatio: format === "story" ? "9 / 16" : "1 / 1", maxHeight: 420 }}
                  >
                    कार्ड बन रहा है…
                  </div>
                )}
              </div>
              <p aria-live="polite" className="sr-only">
                {isGenerating ? "कार्ड बन रहा है" : "कार्ड तैयार है"}
              </p>
            </div>

            {/* The payoff. Green and biggest, every time. */}
            <button className="btn btn--wa btn--block btn--big" onClick={shareWhatsApp}>
              <WhatsAppIcon />
              WhatsApp पर भेजें
            </button>

            <button className="btn btn--save btn--block" onClick={download} disabled={!cardDataUrl}>
              <DownloadIcon />
              फ़ोन में सेव करें
            </button>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn--ghost" style={{ flex: 1, minWidth: 150 }} onClick={shareOther}>
                <ShareIcon /> और जगह
              </button>
              <button className="btn btn--ghost" style={{ flex: 1, minWidth: 150 }} onClick={copyText}>
                <CopyIcon /> कॉपी
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast" role="status"><span aria-hidden="true">🪔</span>{toast}</div>}
    </section>
  );
}

function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div className="step">
      <div className="step-head">
        <span className="step-num" aria-hidden="true">{n}</span>
        <span className="step-label">{label}</span>
      </div>
      {children}
    </div>
  );
}

function TempleIconWrap() {
  return <span style={{ width: 18, height: 18, display: "inline-block" }}><TempleIcon /></span>;
}
