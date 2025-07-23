import React from "react";

interface Quete {
  type: string;
  cible: string;
  description: string;
  completee: boolean;
  progression: number;
  quantite: number;
}

interface QuetesSectionProps {
  quetes: Quete[];
}

const QuetesSection: React.FC<QuetesSectionProps> = ({ quetes }) => (
  <section className="game-area" aria-labelledby="titre-quetes">
    <h2 id="titre-quetes">Quêtes du jour :</h2>
    <ul aria-live="polite">
      {quetes.map((q, idx) => (
        <li key={idx} style={{ textDecoration: q.completee ? "line-through" : "none" }}>
          {q.description} : {q.progression}/{q.quantite} {q.completee ? "✅" : "⏳"}
        </li>
      ))}
    </ul>
  </section>
);

export default QuetesSection;
