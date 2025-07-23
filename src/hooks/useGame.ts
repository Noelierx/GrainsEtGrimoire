import { useState, useRef, useEffect } from "react";
import { Inventaire, ClientActuel } from "../types";
import { typesClients, prix } from "../constants";

export default function useGame() {
  const [argent, setArgent] = useState(50);
  const [satisfaction, setSatisfaction] = useState(80);
  const [reputation, setReputation] = useState(1);
  const [jour, setJour] = useState(1);
  const [clientActuel, setClientActuel] = useState<ClientActuel | null>(null);
  const [inventaire, setInventaire] = useState<Inventaire>({
    cafe: 10,
    the: 8,
    chocolat: 5,
    croissant: 6,
    muffin: 4,
    livres: {
      "Roman": 3,
      "Science-Fiction": 2,
      "Polar": 4,
      "Philosophie": 1,
      "Cuisine": 2
    }
  });
  const [logMessages, setLogMessages] = useState<string[]>([
    "Bienvenue dans votre café-librairie ! Servez vos premiers clients..."
  ]);

  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logMessages]);

  const log = (message: string) => setLogMessages(msgs => [...msgs, message]);

  const nouveauClient = () => {
    if (clientActuel) {
      log("⚠️ Vous avez déjà un client ! Servez-le d'abord.");
      return;
    }
    const clientType = typesClients[Math.floor(Math.random() * typesClients.length)];
    const boissonChoisie = clientType.boissons[Math.floor(Math.random() * clientType.boissons.length)];
    const nourritureChoisie = clientType.nourritures.length > 0 ?
      clientType.nourritures[Math.floor(Math.random() * clientType.nourritures.length)] : null;
    const genreChoisie = clientType.genresLivres[Math.floor(Math.random() * clientType.genresLivres.length)];
    setClientActuel({
      ...clientType,
      boissonDemandee: boissonChoisie,
      nourritureDemandee: nourritureChoisie,
      genreDemande: genreChoisie,
      patienceRestante: clientType.patience,
      servi: { boisson: false, nourriture: false, livre: false }
    });
    log(`👋 ${clientType.nom} entre dans le café.`);
  };

  const servir = (item: string, type: "boisson" | "nourriture") => {
    if (!clientActuel) return;
    if ((inventaire as any)[item] <= 0) {
      log(`❌ Plus de ${item} en stock !`);
      const newClient = { ...clientActuel, patienceRestante: clientActuel.patienceRestante - 1 };
      if (newClient.patienceRestante <= 0) {
        clientParti();
        return;
      }
      setClientActuel(newClient);
      return;
    }
    setInventaire(inv => ({
      ...inv,
      [item]: (inv as any)[item] - 1
    }));
    // Correction : s'assurer que le prix est bien un nombre
    const prixItem = Number((prix as any)[item]) || 0;
    setArgent(a => Number((a + prixItem).toFixed(2)));
    const estPrefere = (type === 'boisson' && item === clientActuel.boissonDemandee) ||
      (type === 'nourriture' && item === clientActuel.nourritureDemandee);
    log(estPrefere ?
      `✅ ${item} servi à ${clientActuel.nom} - Parfait ! (+${prixItem}€)` :
      `✅ ${item} servi à ${clientActuel.nom} - Ça ira (+${prixItem}€)`
    );
    setClientActuel({
      ...clientActuel,
      servi: { ...clientActuel.servi, [type]: true }
    });
  };

  const recommanderLivre = (genre: string) => {
    if (!clientActuel) return;
    if (inventaire.livres[genre] <= 0) {
      log(`❌ Plus de livres de ${genre} en stock !`);
      const newClient = { ...clientActuel, patienceRestante: clientActuel.patienceRestante - 1 };
      if (newClient.patienceRestante <= 0) {
        clientParti();
        return;
      }
      setClientActuel(newClient);
      return;
    }
    setInventaire(inv => ({
      ...inv,
      livres: { ...inv.livres, [genre]: inv.livres[genre] - 1 }
    }));
    setArgent(a => Number((a + prix.livres).toFixed(2)));
    const estPrefere = genre === clientActuel.genreDemande;
    log(estPrefere ?
      `📖 Livre de ${genre} recommandé à ${clientActuel.nom} - Excellent choix ! (+${prix.livres}€)` :
      `📖 Livre de ${genre} recommandé à ${clientActuel.nom} - Intéressant (+${prix.livres}€)`
    );
    setClientActuel({
      ...clientActuel,
      servi: { ...clientActuel.servi, livre: true }
    });
  };

  const terminerService = () => {
    if (!clientActuel) return;
    let satisfactionScore = 50;
    if (clientActuel.servi.boisson) satisfactionScore += 15;
    if (clientActuel.servi.nourriture) satisfactionScore += 10;
    if (clientActuel.servi.livre) satisfactionScore += 20;
    satisfactionScore += clientActuel.patienceRestante * 3;
    if (!clientActuel.servi.boisson) satisfactionScore -= 25;
    if (clientActuel.nourritureDemandee && !clientActuel.servi.nourriture) satisfactionScore -= 15;
    if (!clientActuel.servi.livre) satisfactionScore -= 10;
    setSatisfaction(s => Math.max(0, Math.min(100, s + (satisfactionScore - 70) / 4)));
    log(`👋 ${clientActuel.nom} repart avec ${satisfactionScore}% de satisfaction.`);
    if (satisfactionScore >= 85) {
      log("🌟 Client très satisfait ! Bonus de réputation.");
      setReputation(r => Math.min(5, r + 0.15));
    } else if (satisfactionScore >= 70) {
      setReputation(r => Math.min(5, r + 0.05));
    } else if (satisfactionScore < 50) {
      log("😞 Client pas très content...");
      setReputation(r => Math.max(1, r - 0.1));
    }
    setClientActuel(null);
  };

  const clientParti = () => {
    if (!clientActuel) return;
    log(`😠 ${clientActuel.nom} repart mécontent par manque de patience...`);
    setSatisfaction(s => Math.max(0, s - 15));
    setClientActuel(null);
  };

  const ajusterDifficulte = () => {
    // Pour simplifier, on ne modifie pas les typesClients ici (sinon bug d'état)
    // À implémenter si besoin
  };

  const passerJour = () => {
    setJour(j => j + 1);
    setInventaire(inv => ({
      ...inv,
      cafe: inv.cafe + Math.max(1, 3 - Math.floor((jour + 1) / 10)),
      the: inv.the + Math.max(1, 2 - Math.floor((jour + 1) / 15)),
      chocolat: inv.chocolat + 1,
      croissant: inv.croissant + Math.max(1, 2 - Math.floor((jour + 1) / 12)),
      muffin: inv.muffin + 1
    }));
    ajusterDifficulte();
    log(`🌅 Jour ${jour + 1} commence ! La difficulté augmente...`);
  };

  const acheterLivres = () => {
    if (argent < 20) {
      log("❌ Pas assez d'argent pour acheter des livres !");
      return;
    }
    setArgent(a => Number((a - 20).toFixed(2)));
    setInventaire(inv => ({
      ...inv,
      livres: Object.fromEntries(
        Object.entries(inv.livres).map(([genre, nb]) => [genre, nb + Math.floor(Math.random() * 3) + 1])
      )
    }));
    log("📚 Nouveaux livres achetés ! Stock de livres réapprovisionné.");
  };

  const acheterProduit = (produit: string) => {
    const prixProduit = Number((prix as any)[produit]) || 0;
    if (argent < prixProduit) {
      log(`❌ Pas assez d'argent pour acheter un(e) ${produit} !`);
      return;
    }
    setArgent(a => Number((a - prixProduit).toFixed(2)));
    setInventaire(inv => ({
      ...inv,
      [produit]: (inv as any)[produit] + 1
    }));
    log(`🛒 ${produit.charAt(0).toUpperCase() + produit.slice(1)} acheté(e) !`);
  };

  return {
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
  };
}
