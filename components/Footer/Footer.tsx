"use client";

interface FooterProps {
  onCard: () => void;
  onMandals: () => void;
  onAarti: () => void;
}

export default function Footer({ onCard, onMandals, onAarti }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-mantra">गणपती बाप्पा मोरया</p>

        <nav className="footer-links" aria-label="फुटर मेन्यू">
          <button onClick={onCard}>कार्ड बनाएं</button>
          <button onClick={onMandals}>मंडल देखें</button>
          <button onClick={onAarti}>आरती सुनें</button>
        </nav>

        <p className="footer-fine">
          आपकी फोटो कभी अपलोड नहीं होती — कार्ड आपके ही फ़ोन में बनता है।
          <br />© {new Date().getFullYear()} ganpatibappa.online
        </p>
      </div>
    </footer>
  );
}
