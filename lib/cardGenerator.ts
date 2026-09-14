export type CardFormat = "square" | "story";
export type CardFrame = "temple-arch" | "marigold" | "royal-velvet";

export interface CardOptions {
  senderName?: string;
  blessingMessage: string;
  shloka?: string;
  closing?: string;
  userPhotoDataUrl?: string | null;
  format?: CardFormat; // "square" (1080x1080) or "story" (1080x1920)
  frame?: CardFrame; // "temple-arch" | "marigold" | "royal-velvet"
}

export const GREETING_PRESETS = [
  {
    id: "blessing-1",
    title: "सुख-समृद्धि एवं शांति",
    shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ",
    text: "बाप्पा आपके जीवन के सभी विघ्न दूर करें, और आपके घर में सुख, शांति, समृद्धि तथा उत्तम स्वास्थ्य का वास हो।",
  },
  {
    id: "blessing-2",
    title: "सिद्धिविनायक कृपा",
    shloka: "श्री गणेशाय नमः। सिद्धिविनायक प्रसन्न",
    text: "भगवान सिद्धिविनायक की कृपा दृष्टि सदैव आप और आपके परिवार पर बनी रहे। रिद्धि-सिद्धि के दाता आपके भंडार भरें।",
  },
  {
    id: "blessing-3",
    title: "सफलता और नई उमंग",
    shloka: "प्रणम्य शिरसा देवं गौरीपुत्रं विनायकम्",
    text: "गणेश चतुर्थी के इस पावन पर्व पर बाप्पा का आशीर्वाद आपके जीवन में नई उमंग, अपार सफलता और खुशहाली लाए।",
  },
  {
    id: "blessing-4",
    title: "विघ्नहर्ता रक्षा कवच",
    shloka: "ॐ गं गणपतये नमः। विघ्नहर्ता प्रसीद",
    text: "विघ्नहर्ता आपके सभी कष्टों का हरण करें और आपके हर नेक कार्य में सफलता तथा निरंतर विजय का वरदान दें।",
  },
];

export async function generateBlessingCard(options: CardOptions): Promise<HTMLCanvasElement> {
  const {
    senderName = "",
    blessingMessage,
    shloka = "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ",
    closing = "गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!",
    userPhotoDataUrl,
    format = "square",
    frame = "temple-arch",
  } = options;

  const W = 1080;
  const H = format === "story" ? 1920 : 1080;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Load Ganesha Hero Image
  const ganeshaImg = await loadImage("/images/ganesha_cinematic.jpg");

  // 1. Draw Background based on frame style
  if (frame === "royal-velvet") {
    drawRoyalVelvetBg(ctx, W, H);
  } else if (frame === "marigold") {
    drawMarigoldBg(ctx, W, H);
  } else {
    drawTempleArchBg(ctx, W, H);
  }

  // 2. Draw Decorative Borders / Frame
  if (frame === "marigold") {
    drawMarigoldGarlandBorder(ctx, W, H);
  } else if (frame === "royal-velvet") {
    drawRoyalVelvetBorder(ctx, W, H);
  } else {
    drawTempleArchBorder(ctx, W, H);
  }

  const isStory = format === "story";

  // 3. Top Shloka Header
  const shlokaY = isStory ? 140 : 88;
  ctx.textAlign = "center";
  ctx.fillStyle = "#FDE68A";
  ctx.font = "600 24px 'Noto Serif Devanagari', serif";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 8;
  ctx.fillText("॥ " + shloka + " ॥", W / 2, shlokaY);
  ctx.shadowBlur = 0;

  // 4. Main Festival Title
  const titleY = isStory ? 225 : 155;
  ctx.fillStyle = "#FFFBEB";
  ctx.font = isStory
    ? "bold 56px 'Noto Serif Devanagari', serif"
    : "bold 44px 'Noto Serif Devanagari', serif";
  ctx.shadowColor = "rgba(217, 119, 6, 0.9)";
  ctx.shadowBlur = 24;
  ctx.fillText("गणेश चतुर्थी की हार्दिक शुभकामनाएं", W / 2, titleY);
  ctx.shadowBlur = 0;

  // Floral divider
  drawFloralDivider(ctx, W / 2, titleY + (isStory ? 34 : 26), isStory ? 280 : 220);

  // 5. Ganesha Image
  const imgSize = isStory ? 580 : 410;
  const imgX = (W - imgSize) / 2;
  const imgY = isStory ? 300 : 205;

  if (ganeshaImg) {
    drawGaneshaFrame(ctx, ganeshaImg, imgX, imgY, imgSize, imgSize, isStory ? 36 : 28);
    // Diyas flanking Ganesha
    const diyaScale = isStory ? 1.0 : 0.8;
    drawCanvasDiya(ctx, imgX - 24, imgY + imgSize * 0.82, diyaScale);
    drawCanvasDiya(ctx, imgX + imgSize + 24, imgY + imgSize * 0.82, diyaScale);
  }

  // 6. Sacred Blessing Message
  const msgStartY = isStory ? 970 : 670;
  ctx.fillStyle = "#FFFDF5";
  ctx.font = isStory
    ? "500 34px 'Noto Serif Devanagari', sans-serif"
    : "500 26px 'Noto Serif Devanagari', sans-serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 6;
  const msgMaxW = W - 220;
  const lineH = isStory ? 56 : 40;
  const textEndY = wrapText(ctx, blessingMessage, W / 2, msgStartY, msgMaxW, lineH);
  ctx.shadowBlur = 0;

  // 7. Closing Salutation
  const closingY = isStory
    ? Math.max(textEndY + 40, 1380)
    : Math.max(textEndY + 22, 875);

  ctx.fillStyle = "#FDE047";
  ctx.font = isStory
    ? "bold 44px 'Noto Serif Devanagari', serif"
    : "bold 34px 'Noto Serif Devanagari', serif";
  ctx.shadowColor = "rgba(234, 88, 12, 0.8)";
  ctx.shadowBlur = 18;
  ctx.fillText(closing, W / 2, closingY);
  ctx.shadowBlur = 0;

  // 8. Bottom Signature Banner ("शुभेच्छुक: [नाम]")
  const signatureY = isStory ? 1650 : 975;
  const trimmedName = senderName.trim();

  if (trimmedName) {
    const signatureText = `शुभेच्छुक: ${trimmedName}`;
    drawSignatureBanner(
      ctx,
      signatureText,
      W / 2,
      signatureY,
      W,
      userPhotoDataUrl ? 60 : 0,
      isStory
    );

    if (userPhotoDataUrl) {
      const userImg = await loadImage(userPhotoDataUrl);
      if (userImg) {
        const photoRadius = isStory ? 56 : 42;
        const photoX = isStory ? 150 : 130;
        const photoY = signatureY;
        drawCircularUserPhoto(ctx, userImg, photoX, photoY, photoRadius);
      }
    }
  } else {
    ctx.fillStyle = "rgba(253, 230, 138, 0.85)";
    ctx.font = isStory
      ? "600 30px 'Noto Serif Devanagari', serif"
      : "600 24px 'Noto Serif Devanagari', serif";
    ctx.fillText("॥ ॐ गं गणपतये नमः ॥", W / 2, signatureY);
  }

  // 9. Subtle watermark at bottom
  const watermarkY = H - (isStory ? 44 : 24);
  ctx.fillStyle = "rgba(254, 243, 199, 0.55)";
  ctx.font = isStory ? "500 20px sans-serif" : "500 16px sans-serif";
  ctx.fillText("bappablessings.online  |  Ganesh Utsav 2026", W / 2, watermarkY);

  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawTempleArchBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const grad = ctx.createRadialGradient(W / 2, H * 0.38, 60, W / 2, H * 0.45, W * 0.9);
  grad.addColorStop(0, "#C2410C");
  grad.addColorStop(0.35, "#9A3412");
  grad.addColorStop(0.7, "#581C08");
  grad.addColorStop(1, "#260B02");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawSubtleSunRays(ctx, W, H * 0.35, "rgba(253, 230, 138, 0.04)");
}

function drawMarigoldBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#7C2D12");
  grad.addColorStop(0.3, "#991B1B");
  grad.addColorStop(0.7, "#7F1D1D");
  grad.addColorStop(1, "#450A0A");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawSubtleSunRays(ctx, W, H * 0.35, "rgba(245, 158, 11, 0.05)");
}

function drawRoyalVelvetBg(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const grad = ctx.createRadialGradient(W / 2, H * 0.4, 50, W / 2, H * 0.5, W);
  grad.addColorStop(0, "#6B1028");
  grad.addColorStop(0.5, "#430919");
  grad.addColorStop(0.85, "#25030D");
  grad.addColorStop(1, "#120106");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawSubtleSunRays(ctx, W, H * 0.35, "rgba(253, 224, 71, 0.04)");
}

function drawSubtleSunRays(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * 1400, cy + Math.sin(a) * 1400);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTempleArchBorder(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const m = 36;
  ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
  ctx.lineWidth = 4;
  ctx.strokeRect(m, m, W - m * 2, H - m * 2);

  ctx.strokeStyle = "rgba(253, 230, 138, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(m + 12, m + 12, W - (m + 12) * 2, H - (m + 12) * 2);

  [
    [m, m, 0],
    [W - m, m, Math.PI / 2],
    [W - m, H - m, Math.PI],
    [m, H - m, -Math.PI / 2],
  ].forEach(([x, y, angle]) => drawCornerMotif(ctx, x, y, angle));

  drawHangingBell(ctx, W / 2, m + 14);
}

function drawMarigoldGarlandBorder(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const m = 32;
  ctx.strokeStyle = "rgba(234, 88, 12, 0.7)";
  ctx.lineWidth = 3;
  ctx.strokeRect(m, m, W - m * 2, H - m * 2);

  ctx.save();
  const step = 48;
  for (let x = m + 24; x < W - m; x += step) {
    drawMarigoldFlower(ctx, x, m + 4, 12);
    drawMarigoldFlower(ctx, x, H - m - 4, 12);
  }
  for (let y = m + 48; y < H - m - 20; y += step) {
    drawMarigoldFlower(ctx, m + 4, y, 12);
    drawMarigoldFlower(ctx, W - m - 4, y, 12);
  }
  ctx.restore();
}

function drawRoyalVelvetBorder(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const m = 38;
  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 5;
  ctx.strokeRect(m, m, W - m * 2, H - m * 2);

  ctx.strokeStyle = "#FEF08A";
  ctx.lineWidth = 2;
  ctx.strokeRect(m + 10, m + 10, W - (m + 10) * 2, H - (m + 10) * 2);

  [
    [m + 5, m + 5],
    [W - m - 5, m + 5],
    [W - m - 5, H - m - 5],
    [m + 5, H - m - 5],
  ].forEach(([x, y]) => {
    ctx.fillStyle = "#DC2626";
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FDE047";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function drawCornerMotif(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = "#FCD34D";
  ctx.fillStyle = "#F59E0B";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(42, 0);
  ctx.arc(42, 42, 42, -Math.PI / 2, Math.PI, true);
  ctx.lineTo(0, 42);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(16, 16, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMarigoldFlower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  ctx.fillStyle = "#EA580C";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FBBF24";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#B45309";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawHangingBell(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = "#F59E0B";
  ctx.fillStyle = "#FDE047";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 16);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 10, y + 28);
  ctx.quadraticCurveTo(x - 9, y + 16, x, y + 16);
  ctx.quadraticCurveTo(x + 9, y + 16, x + 10, y + 28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y + 31, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFloralDivider(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number
) {
  ctx.save();
  ctx.strokeStyle = "rgba(253, 230, 138, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - len / 2, y);
  ctx.lineTo(x - 22, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 22, y);
  ctx.lineTo(x + len / 2, y);
  ctx.stroke();

  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#FDE68A";
  ctx.beginPath();
  ctx.arc(x - 12, y, 3, 0, Math.PI * 2);
  ctx.arc(x + 12, y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGaneshaFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const cx = x + w / 2;
  const cy = y + h / 2;

  const aura = ctx.createRadialGradient(cx, cy, w * 0.25, cx, cy, w * 0.72);
  aura.addColorStop(0, "rgba(254, 240, 138, 0.65)");
  aura.addColorStop(0.4, "rgba(245, 158, 11, 0.35)");
  aura.addColorStop(0.8, "rgba(234, 88, 12, 0.12)");
  aura.addColorStop(1, "rgba(180, 83, 9, 0)");
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, w * 0.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  roundRect(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();

  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 6;
  ctx.shadowColor = "rgba(245, 158, 11, 0.7)";
  ctx.shadowBlur = 18;
  roundRect(ctx, x, y, w, h, r);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(254, 243, 199, 0.6)";
  ctx.lineWidth = 2;
  roundRect(ctx, x + 8, y + 8, w - 16, h - 16, r - 6);
  ctx.stroke();
}

function drawSignatureBanner(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  W: number,
  photoOffset: number,
  isStory: boolean
) {
  ctx.font = isStory
    ? "bold 38px 'Noto Serif Devanagari', sans-serif"
    : "bold 28px 'Noto Serif Devanagari', sans-serif";

  const textW = ctx.measureText(text).width;
  const paddingX = 48;
  const bannerW = Math.min(W - 140, textW + paddingX * 2);
  const bannerH = isStory ? 68 : 52;
  const bannerX = (W - bannerW) / 2 + (photoOffset > 0 ? 30 : 0);
  const bannerY = cy - bannerH / 2;

  const g = ctx.createLinearGradient(bannerX, bannerY, bannerX + bannerW, bannerY);
  g.addColorStop(0, "rgba(234, 88, 12, 0.2)");
  g.addColorStop(0.2, "rgba(180, 83, 9, 0.85)");
  g.addColorStop(0.8, "rgba(180, 83, 9, 0.85)");
  g.addColorStop(1, "rgba(234, 88, 12, 0.2)");

  ctx.fillStyle = g;
  roundRect(ctx, bannerX, bannerY, bannerW, bannerH, bannerH / 2);
  ctx.fill();

  ctx.strokeStyle = "#FDE68A";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#FFFBEB";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 8;
  ctx.textAlign = "center";
  ctx.fillText(text, bannerX + bannerW / 2, bannerY + bannerH * 0.72);
  ctx.shadowBlur = 0;
}

function drawCircularUserPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  r: number
) {
  const glow = ctx.createRadialGradient(cx, cy, r - 4, cx, cy, r + 16);
  glow.addColorStop(0, "rgba(245, 158, 11, 0.9)");
  glow.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

  ctx.strokeStyle = "#F59E0B";
  ctx.lineWidth = 4.5;
  ctx.shadowColor = "rgba(245, 158, 11, 0.8)";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "#FFFBEB";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCanvasDiya(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#C2410C";
  ctx.beginPath();
  ctx.ellipse(0, 0, 32, 14, 0, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#FDE68A";
  ctx.lineWidth = 2;
  ctx.stroke();

  const fg = ctx.createRadialGradient(0, -15, 2, 0, -15, 22);
  fg.addColorStop(0, "#FFFFFF");
  fg.addColorStop(0.3, "#FDE047");
  fg.addColorStop(0.7, "#EA580C");
  fg.addColorStop(1, "rgba(234, 88, 12, 0)");
  ctx.fillStyle = fg;
  ctx.beginPath();
  ctx.arc(0, -15, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#FEF08A";
  ctx.beginPath();
  ctx.moveTo(-7, -4);
  ctx.quadraticCurveTo(-11, -18, 0, -32);
  ctx.quadraticCurveTo(11, -18, 7, -4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number
): number {
  const words = text.split(" ");
  let line = "";
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line ? `${line} ${words[n]}` : words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxW && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n];
      curY += lh;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
  return curY;
}
