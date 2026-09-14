"use client";

import { analytics } from "@/lib/analytics";

interface ChoicesProps {
  onCard: () => void;
  onMandals: () => void;
  onAarti: () => void;
}

/**
 * The site's real navigation.
 *
 * Three oversized, colour-coded, picture-led tiles answering one question —
 * "what do you want to do?" Someone who cannot read the copy can still tell
 * these apart by colour and symbol, which a text menu never allows.
 */
export default function Choices({ onCard, onMandals, onAarti }: ChoicesProps) {
  const tiles = [
    {
      key: "card",
      cls: "choice--card",
      emoji: "💌",
      title: "कार्ड बनाएं",
      desc: "अपना नाम और फोटो डालें",
      go: onCard,
    },
    {
      key: "mandal",
      cls: "choice--mandal",
      emoji: "🛕",
      title: "मंडल देखें",
      desc: "मुंबई के बड़े गणपति",
      go: onMandals,
    },
    {
      key: "aarti",
      cls: "choice--aarti",
      emoji: "🎶",
      title: "आरती सुनें",
      desc: "भजन और आरती",
      go: onAarti,
    },
  ];

  return (
    <section className="choices">
      <div className="container">
        <div className="choices-grid">
          {tiles.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`choice ${t.cls}`}
              onClick={() => {
                analytics.ctaClicked(`choice_${t.key}`);
                t.go();
              }}
            >
              <span className="choice-icon" aria-hidden="true">{t.emoji}</span>
              <span className="choice-title">{t.title}</span>
              <span className="choice-desc">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
