import React from "react";

import React from "react";
import { Inventaire } from "../types";

interface InventaireProps {
  inventaire: Inventaire;
  acheterProduit: (produit: string) => void;
  acheterLivres: () => void;
}

const InventaireSection: React.FC<InventaireProps> = ({ inventaire, acheterProduit, acheterLivres }) => (
  <section className="game-area" aria-labelledby="titre-inventaire">
    <h2 id="titre-inventaire">Inventaire :</h2>
    <div className="inventory" id="inventaire">
      <div className="inventory-list" aria-label="Liste des stocks">
        <div className="inventory-title">Produits</div>
        <div className="item">☕ Café: {inventaire.cafe}</div>
        <div className="item">🫖 Thé: {inventaire.the}</div>
        <div className="item">🍫 Chocolat: {inventaire.chocolat}</div>
        <div className="item">🥐 Croissant: {inventaire.croissant}</div>
        <div className="item">🧁 Muffin: {inventaire.muffin}</div>
        <div className="inventory-separator"></div>
        <div className="inventory-title">Livres</div>
        <div className="item">📚 Romans: {inventaire.livres["Roman"]}</div>
        <div className="item">🚀 Science-Fiction: {inventaire.livres["Science-Fiction"]}</div>
        <div className="item">🔍 Polars: {inventaire.livres["Polar"]}</div>
        <div className="item">🤔 Philosophie: {inventaire.livres["Philosophie"]}</div>
        <div className="item">👨‍🍳 Cuisine: {inventaire.livres["Cuisine"]}</div>
      </div>
    </div>
    <div className="inventory-separator"></div>
    <div className="inventory-actions" role="group" aria-label="Actions d'achat">
      <button onClick={() => acheterProduit("cafe")} aria-label="Acheter Café (3 euros)">Acheter Café (3€)</button>
      <button onClick={() => acheterProduit("the")} aria-label="Acheter Thé (2,5 euros)">Acheter Thé (2.5€)</button>
      <button onClick={() => acheterProduit("chocolat")} aria-label="Acheter Chocolat (4 euros)">Acheter Chocolat (4€)</button>
      <button onClick={() => acheterProduit("croissant")} aria-label="Acheter Croissant (2 euros)">Acheter Croissant (2€)</button>
      <button onClick={() => acheterProduit("muffin")} aria-label="Acheter Muffin (3 euros)">Acheter Muffin (3€)</button>
      <button onClick={acheterLivres} aria-label="Acheter des livres pour 20 euros">Acheter des Livres (20€)</button>
    </div>
  </section>
);

export default InventaireSection;
