"use client";

import { useState, useRef, useCallback, useEffect, useImperativeHandle } from "react";
import { generateBlessingCard, CardFormat, CardFrame, GREETING_PRESETS } from "@/lib/cardGenerator";
import { analytics } from "@/lib/analytics";
import { WhatsAppIcon, DownloadIcon, ShareIcon, CameraIcon, CopyIcon } from "@/components/icons";

export interface BlessingHandle {
  shareWhatsApp: () => void;
}

interface BlessingExperienceProps {
  initialName?: string;
  ref?: React.Ref<BlessingHandle>;
}

const FORMATS: { id: CardFormat; name: string; shape: string }[] = [
  { id: "square", name: "चैट के लिए", shape: "square" },
  { id: "story", name: "स्टेटस के लिए", shape: "story" },
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
  const [toast, setToast] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preset = GREETING_PRESETS.find((p) => p.id === presetId) || GREETING_PRESETS[0];
  const message = isCustom ? customMessage || preset.text : preset.text;

  const say = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
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
      say("कार्ड नहीं बना। दोबारा कोशिश करें।");
    } finally {
      setIsGenerating(false);
    }
  }, [senderName, message, preset.shloka, photoUrl, format, frame, say]);

  useEffect(() => {
    const t = setTimeout(renderCard, 180);
    return () => clearTimeout(t);
  }, [renderCard]);

  const siteUrl = () =>
    typeof window === "undefined" ? "https://ganpatibappa.online" : window.location.origin;

  const shareText = useCallback(() => {
    const name = senderName.trim();
    const from = name ? `\n— *${name}*\n` : "";
    const referralUrl = name ? `${siteUrl()}?from=${encodeURIComponent(name)}` : siteUrl();
    return `🌺 *गणेश चतुर्थी की हार्दिक शुभकामनाएं!* 🙏\n\n${message}\n\n*गणपती बाप्पा मोरया!*${from}\n\n✨ आप भी अपने नाम का विशेष कार्ड बनाएं:\n👉 ${referralUrl}`;
  }, [senderName, message]);

  const download = useCallback(() => {
    if (!cardDataUrl) { say("कार्ड बन रहा है…"); return; }
    const a = document.createElement("a");
    const safe = senderName.trim() ? senderName.trim().replace(/\s+/g, "-") : "ganesh";
    a.download = `bappa-${format}-${safe}.png`;
    a.href = cardDataUrl;
    a.click();
    say("कार्ड सेव हो गया");
    analytics.cardDownloaded(format, frame, Boolean(photoUrl));
  }, [cardDataUrl, senderName, format, frame, photoUrl, say]);

  /** One WhatsApp path for the whole site. Shares the image where possible. */
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
            say("भेज दिया");
            return;
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText())}`, "_blank");
    say("WhatsApp खुल रहा है…");
  }, [format, shareText, say]);

  useImperativeHandle(ref, () => ({ shareWhatsApp }), [shareWhatsApp]);

  const shareOther = async () => {
    if (!navigator.share) { download(); return; }
    try {
      await navigator.share({ text: shareText(), url: siteUrl() });
      analytics.cardShared("native", format);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") download();
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText());
      say("कॉपी हो गया");
      analytics.cardShared("copy_link", format);
    } catch {
      say("कॉपी नहीं हुआ");
    }
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { say("कोई फोटो चुनें"); return; }
    if (file.size > MAX_PHOTO_BYTES) { say("फोटो बहुत बड़ी है (8 MB तक)"); return; }

    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target?.result as string);
      say("फोटो लग गई");
      analytics.photoAdded();
    };
    reader.onerror = () => say("फोटो नहीं खुली");
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    setPhotoName("");
    if (fileRef.current) fileRef.current.value = "";
    say("फोटो हटा दी");
  };

  return (
    <section id="card" className="section" style={{ scrollMarginTop: 80 }}>
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">कार्ड बनाएं</p>
          <h2 className="display section-title">अपना कार्ड बनाकर भेजें</h2>
          <p className="lede section-lede">नीचे चुनते जाएं — कार्ड साथ-साथ बनता जाएगा।</p>
        </div>

        <div className="maker" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          <div className="panel">
            <Step n={1} label="कहाँ भेजना है?">
              <div className="opts opts--2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="opt"
                    aria-pressed={format === f.id}
                    onClick={() => { setFormat(f.id); analytics.cardCustomised("format", f.id); }}
                  >
                    <span className={`opt-shape opt-shape--${f.shape}`} aria-hidden="true" />
                    {f.name}
                  </button>
                ))}
              </div>
            </Step>

            <Step n={2} label="रंग चुनें">
              <div className="opts opts--5">
                {FRAMES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="opt"
                    aria-pressed={frame === f.id}
                    onClick={() => { setFrame(f.id); analytics.cardCustomised("frame", f.id); }}
                  >
                    <span className={`opt-swatch sw--${f.id}`} aria-hidden="true" />
                    {f.name}
                  </button>
                ))}
              </div>
            </Step>

            <Step n={3} label="संदेश चुनें">
              <div className="opts" role="radiogroup" aria-label="संदेश">
                {GREETING_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    className="opt opt--msg"
                    aria-checked={!isCustom && presetId === p.id}
                    onClick={() => { setPresetId(p.id); setIsCustom(false); analytics.cardCustomised("message", p.id); }}
                  >
                    <span className="opt-msg-title">{p.title}</span>
                    <span className="opt-msg-text">{p.text}</span>
                  </button>
                ))}
                <button type="button" className="opt opt--msg" aria-pressed={isCustom} onClick={() => setIsCustom(true)}>
                  <span className="opt-msg-title">खुद लिखें</span>
                </button>
                {isCustom && (
                  <textarea
                    className="textarea"
                    rows={3}
                    maxLength={220}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="अपना संदेश यहाँ लिखें…"
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
              <p className="step-hint">कार्ड पर नीचे दिखेगा। खाली भी छोड़ सकते हैं।</p>
            </Step>

            <Step n={5} label="अपनी फोटो">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="button" className="btn btn--outline" onClick={() => fileRef.current?.click()}>
                  <CameraIcon />
                  {photoName ? "फोटो बदलें" : "फोटो चुनें"}
                </button>
                {photoUrl && (
                  <button type="button" className="btn btn--outline" onClick={removePhoto}>हटाएं</button>
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
              <p className="step-hint">फोटो आपके फ़ोन से बाहर नहीं जाती।</p>
            </Step>
          </div>

          <div className="preview">
            <div className="preview-stage">
              {cardDataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={cardDataUrl}
                  alt="आपका तैयार कार्ड"
                  className="preview-img"
                  style={{
                    maxHeight: format === "story" ? 460 : 380,
                    opacity: isGenerating ? 0.6 : 1,
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

            <p className="preview-meta">
              <span>{format === "square" ? "चैट · चौकोर" : "स्टेटस · लंबा"}</span>
              <span aria-live="polite">{isGenerating ? "बन रहा है…" : "तैयार"}</span>
            </p>

            <button className="btn btn--wa btn--block btn--hero" onClick={shareWhatsApp}>
              <WhatsAppIcon />
              WhatsApp पर भेजें
            </button>

            <button className="btn btn--outline btn--block" onClick={download} disabled={!cardDataUrl}>
              <DownloadIcon />
              फ़ोन में सेव करें
            </button>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn--outline" style={{ flex: 1 }} onClick={shareOther}>
                <ShareIcon /> और जगह
              </button>
              <button className="btn btn--outline" style={{ flex: 1 }} onClick={copyText}>
                <CopyIcon /> कॉपी
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
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
