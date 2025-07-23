import React, { useEffect, useRef } from "react";
import { ClientActuel, Inventaire } from "../types";

interface ClientSectionProps {
  clientActuel: ClientActuel | null;
  inventaire: Inventaire;
  servir: (item: string, type: "boisson" | "nourriture") => void;
  recommanderLivre: (genre: string) => void;
  terminerService: () => void;
  nouveauClient: () => void;
  passerJour: () => void;
  objetsDebloques: {
    boissons: string[];
    nourritures: string[];
    genresLivres: string[];
  };
}

const ClientSection: React.FC<ClientSectionProps> = ({
  clientActuel,
  inventaire,
  servir,
  recommanderLivre,
  terminerService,
  nouveauClient,
  passerJour,
  objetsDebloques
}) => {
  const firstActionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (clientActuel && firstActionRef.current) {
      firstActionRef.current.focus();
    }
  }, [clientActuel]);

  return (
    <section className="game-area" aria-labelledby="titre-client-actuel">
      <h2 id="titre-client-actuel">Client actuel :</h2>
      <div id="client-actuel" className="client" aria-live="polite">
        {!clientActuel ? (
          <>Aucun client pour le moment...</>
        ) : (
          <>
            <div><strong>{clientActuel.nom}</strong></div>
            <div style={{ fontStyle: "italic" }}>{clientActuel.description}</div>
            <div className="commande">
              Souhaite : {clientActuel.boissonDemandee}
              {clientActuel.nourritureDemandee && ` + ${clientActuel.nourritureDemandee}`}
            </div>
            <div>
              Patience: {"❤️".repeat(clientActuel.patienceRestante)} | Budget: {clientActuel.budget}€
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
              ✨ = choix préféré du client | Les autres choix sont acceptés mais moins appréciés
            </div>
            <div
              className="actions"
              role="group"
              aria-label="Actions de service"
            >
              {!clientActuel.servi.boisson && clientActuel.boissons
                .filter(boisson => objetsDebloques.boissons.includes(boisson))
                .map((boisson: string, idx: number) => (
                  <button
                    key={boisson}
                    ref={idx === 0 ? firstActionRef : undefined}
                    onClick={() => servir(boisson, "boisson")}
                    disabled={(inventaire as any)[boisson] <= 0}
                    aria-label={`Servir ${boisson}${boisson === clientActuel.boissonDemandee ? " (préféré)" : ""}${(inventaire as any)[boisson] <= 0 ? " (rupture)" : ""}`}
                  >
                    {boisson === clientActuel.boissonDemandee ? "✨" : ""}
                    {boisson}
                    {(inventaire as any)[boisson] <= 0 ? " (rupture)" : ""}
                  </button>
                ))
              }
              {!clientActuel.servi.nourriture && clientActuel.nourritures
                .filter(nourriture => objetsDebloques.nourritures.includes(nourriture))
                .map((nourriture: string, idx: number) => {
                  const shouldFocus =
                    clientActuel.servi.boisson &&
                    idx === 0 &&
                    !clientActuel.servi.nourriture;
                  return (
                    <button
                      key={nourriture}
                      ref={shouldFocus ? firstActionRef : undefined}
                      onClick={() => servir(nourriture, "nourriture")}
                      disabled={(inventaire as any)[nourriture] <= 0}
                      aria-label={`Servir ${nourriture}${nourriture === clientActuel.nourritureDemandee ? " (préféré)" : ""}${(inventaire as any)[nourriture] <= 0 ? " (rupture)" : ""}`}
                    >
                      {nourriture === clientActuel.nourritureDemandee ? "✨" : ""}
                      {nourriture}
                      {(inventaire as any)[nourriture] <= 0 ? " (rupture)" : ""}
                    </button>
                  );
                })
              }
              {!clientActuel.servi.livre && (() => {
                const filteredNourritures = clientActuel.nourritures.filter(n => objetsDebloques.nourritures.includes(n));
                return clientActuel.genresLivres
                  .filter(genre => objetsDebloques.genresLivres.includes(genre))
                  .map((genre: string, idx: number) => {
                    const shouldFocus =
                      clientActuel.servi.boisson &&
                      (filteredNourritures.length === 0 || clientActuel.servi.nourriture) &&
                      idx === 0 &&
                      !clientActuel.servi.livre;
                    return (
                      <button
                        key={genre}
                        ref={shouldFocus ? firstActionRef : undefined}
                        onClick={() => recommanderLivre(genre)}
                        disabled={inventaire.livres[genre] <= 0}
                        aria-label={`Recommander livre ${genre}${genre === clientActuel.genreDemande ? " (préféré)" : ""}${inventaire.livres[genre] <= 0 ? " (rupture)" : ""}`}
                      >
                        {genre === clientActuel.genreDemande ? "✨" : ""}
                        {genre}
                        {inventaire.livres[genre] <= 0 ? " (rupture)" : ""}
                      </button>
                    );
                  });
              })()}
              <div className="terminer-service-separator"></div>
              <button onClick={terminerService}>
                Terminer le service
              </button>
            </div>
          </>
        )}
      </div>
      <nav className="actions">
        <button onClick={nouveauClient}>Nouveau Client</button>
        <button onClick={passerJour}>Passer au Jour Suivant</button>
      </nav>
    </section>
  );
};

export default ClientSection;