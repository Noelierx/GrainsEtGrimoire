import React from "react";
import { Inventaire, ClientActuel } from "../types";
import { prixAchat } from "../constants";

interface InventaireProps {
  inventaire: Inventaire;
  acheterProduit: (produit: string) => void;
  acheterLivres: () => void;
  objetsDebloques: {
    boissons: string[];
    nourritures: string[];
    genresLivres: string[];
  };
  clientActuel?: ClientActuel | null;
}

const InventaireSection: React.FC<InventaireProps> = ({
  inventaire,
  acheterProduit,
  acheterLivres,
  objetsDebloques,
  clientActuel
}) => {
  let produitsUniques = Array.from(new Set([...objetsDebloques.boissons, ...objetsDebloques.nourritures]));

  if (clientActuel) {
    if (clientActuel.boissonDemandee && !produitsUniques.includes(clientActuel.boissonDemandee)) {
      produitsUniques.push(clientActuel.boissonDemandee);
    }
    if (
      clientActuel.nourritureDemandee &&
      !produitsUniques.includes(clientActuel.nourritureDemandee)
    ) {
      produitsUniques.push(clientActuel.nourritureDemandee);
    }
  }

  return (
    <section className="game-area" aria-labelledby="titre-inventaire">
      <h2 id="titre-inventaire">Inventaire :</h2>
      <div className="inventory" id="inventaire">
        <div className="inventory-list" aria-label="Liste des stocks">
          <div className="inventory-title">Produits</div>
          {produitsUniques.map(p => (
            <div className="item" key={p}>
              {p}: {(inventaire as any)[p] ?? 0}
            </div>
          ))}
          <div className="inventory-separator"></div>
          <div className="inventory-title">Livres</div>
          {objetsDebloques.genresLivres.map(g => (
            <div className="item" key={g}>
              {g}: {inventaire.livres[g]}
            </div>
          ))}
        </div>
      </div>
      <div className="inventory-separator"></div>
      <div className="inventory-actions" role="group" aria-label="Actions d'achat">
        {produitsUniques.map(p => (
          <button key={p} onClick={() => acheterProduit(p)} aria-label={`Acheter ${p}`}>
            Acheter {p} ({prixAchat[p as keyof typeof prixAchat] ?? "?"}€)
          </button>
        ))}
        <button onClick={acheterLivres} aria-label="Acheter des livres pour 12 euros">
          Acheter des Livres ({prixAchat.livres}€)
        </button>
      </div>
    </section>
  );
};

export default InventaireSection;
