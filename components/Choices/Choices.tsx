"use client";

import { analytics } from "@/lib/analytics";
import { CardIcon, MapPinIcon, MusicIcon } from "@/components/icons";

interface ChoicesProps {
  onCard: () => void;
  onMandals: () => void;
  onAarti: () => void;
}

/**
 * Three plain tiles. Line icons rather than emoji — emoji render differently
 * on every device and read as decoration, not interface.
 */
export default function Choices({ onCard, onMandals, onAarti }: ChoicesProps) {
  const tiles = [
    { key: "card", Icon: CardIcon, title: "कार्ड बनाएं", desc: "नाम और फोटो के साथ", go: onCard },
    { key: "mandal", Icon: MapPinIcon, title: "मंडल देखें", desc: "मुंबई के बड़े गणपति", go: onMandals },
    { key: "aarti", Icon: MusicIcon, title: "आरती सुनें", desc: "आरती और भजन", go: onAarti },
  ];

  return (
    <section className="section section--band section--line">
      <div className="container">
        <div className="choices">
          {tiles.map(({ key, Icon, title, desc, go }) => (
            <button
              key={key}
              type="button"
              className="choice"
              onClick={() => {
                analytics.ctaClicked(`choice_${key}`);
                go();
              }}
            >
              <span className="choice-icon" aria-hidden="true"><Icon /></span>
              <span className="choice-title">{title}</span>
              <span className="choice-desc">{desc}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
