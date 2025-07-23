import React from "react";
import "./App.css";
import Stats from "./components/Stats";
import ClientSection from "./components/ClientSection";
import InventaireSection from "./components/InventaireSection";
import Journal from "./components/Journal";
import useGame from "./hooks/useGame";

function App() {
  const {
    argent,
    satisfaction,
    reputation,
    jour,
    clientActuel,
    inventaire,
    logMessages,
    logRef,
    nouveauClient,
    servir,
    recommanderLivre,
    terminerService,
    passerJour,
    acheterLivres,
    acheterProduit
  } = useGame();

  return (
    <div className="App">
      <header className="header" role="banner">
        <h1>☕ Le Café-Librairie ☕</h1>
        <p>Servez vos clients et recommandez-leur les meilleurs livres !</p>
      </header>
      <div className="main-layout">
        <div className="left-panel">
          <Stats
            argent={argent}
            satisfaction={satisfaction}
            reputation={reputation}
            jour={jour}
          />
          <Journal logMessages={logMessages} logRef={logRef} />
        </div>
        <div className="right-panel">
          <ClientSection
            clientActuel={clientActuel}
            inventaire={inventaire}
            servir={servir}
            recommanderLivre={recommanderLivre}
            terminerService={terminerService}
            nouveauClient={nouveauClient}
            passerJour={passerJour}
          />
          <InventaireSection
            inventaire={inventaire}
            acheterProduit={acheterProduit}
            acheterLivres={acheterLivres}
          />
        </div>
      </div>
    </div>
  );
}

export default App;