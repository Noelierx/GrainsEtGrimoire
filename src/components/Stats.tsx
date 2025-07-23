import React from "react";

const niveauxReputation = ['Débutant', 'Apprenti', 'Expérimenté', 'Expert', 'Maître'];

interface StatsProps {
  argent: number;
  satisfaction: number;
  reputation: number;
  jour: number;
}

const Stats = ({ argent, satisfaction, reputation, jour }: StatsProps) => (
  <section className="stats" aria-label="Statistiques du jeu">
    <div className="stat">
      <div>💰 Argent</div>
      <div>{argent}€</div>
    </div>
    <div className="stat">
      <div>😊 Satisfaction</div>
      <div>{satisfaction}%</div>
    </div>
    <div className="stat">
      <div>📚 Réputation</div>
      <div>{niveauxReputation[Math.min(Math.floor(reputation) - 1, 4)]}</div>
    </div>
    <div className="stat">
      <div>⏰ Jour</div>
      <div>{jour}</div>
    </div>
  </section>
);

export default Stats;
