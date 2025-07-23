import { ClientType, ClientActuel, Inventaire, HandleEndServiceProps, HandleClientLeaveProps, HandleClientActionProps, HandlePurchaseProps, Quete } from "../types";
import { prixAchat, prixVente, allBoissons, allNourritures, allGenresLivres } from "../constants";
import React from "react";

// Génération dynamique des types de quêtes
const queteQuantites = {
  boisson: { min: 2, max: 5 },
  nourriture: { min: 2, max: 4 },
  livre: { min: 2, max: 5 }
};

export function getTypesQuetes() {
  return [
    ...allBoissons.map(b => ({
      type: "boisson",
      cible: b,
      description: `Servir des ${b}`,
      min: queteQuantites.boisson.min,
      max: queteQuantites.boisson.max
    })),
    ...allNourritures.map(n => ({
      type: "nourriture",
      cible: n,
      description: `Servir des ${n}`,
      min: queteQuantites.nourriture.min,
      max: queteQuantites.nourriture.max
    })),
    ...allGenresLivres.map(g => ({
      type: "livre",
      cible: g,
      description: `Recommander des livres de ${g}`,
      min: queteQuantites.livre.min,
      max: queteQuantites.livre.max
    }))
  ];
}

export function getRandomClient(
  typesClients: ClientType[],
  objetsDebloques: { boissons: string[], nourritures: string[], genresLivres: string[] }
): ClientActuel {
  const clientType = typesClients[Math.floor(Math.random() * typesClients.length)];

  const boissonsPossibles = clientType.boissons.filter(b => objetsDebloques.boissons.includes(b));
  const nourrituresPossibles = clientType.nourritures.filter(n => objetsDebloques.nourritures.includes(n));
  const genresLivresPossibles = clientType.genresLivres.filter(g => objetsDebloques.genresLivres.includes(g));

  const boissonsList = boissonsPossibles.length > 0 ? boissonsPossibles : objetsDebloques.boissons;
  const boissonChoisie = boissonsList[Math.floor(Math.random() * boissonsList.length)];

  const nourrituresList = nourrituresPossibles.length > 0 ? nourrituresPossibles : objetsDebloques.nourritures;
  const nourritureChoisie = nourrituresList.length > 0 
    ? nourrituresList[Math.floor(Math.random() * nourrituresList.length)]
    : null;

  const genresList = genresLivresPossibles.length > 0 ? genresLivresPossibles : objetsDebloques.genresLivres;
  const genreChoisie = genresList[Math.floor(Math.random() * genresList.length)];

  return {
    nom: clientType.nom,
    description: clientType.description,
    patience: clientType.patience,
    budget: clientType.budget,
    boissonDemandee: boissonChoisie,
    nourritureDemandee: nourritureChoisie,
    genreDemande: genreChoisie,
    patienceRestante: clientType.patience,
    servi: { boisson: false, nourriture: false, livre: false },
    boissons: clientType.boissons,
    nourritures: clientType.nourritures,
    genresLivres: clientType.genresLivres
  };
}

export function handleEndService({
  clientActuel,
  setSatisfaction,
  setReputation,
  log,
  setClientActuel
}: HandleEndServiceProps) {
  if (!clientActuel) return;
  let satisfactionScore = 50;
  if (clientActuel.servi.boisson) satisfactionScore += 15;
  if (clientActuel.servi.nourriture) satisfactionScore += 10;
  if (clientActuel.servi.livre) satisfactionScore += 20;
  satisfactionScore += clientActuel.patienceRestante * 3;
  if (!clientActuel.servi.boisson) satisfactionScore -= 25;
  if (clientActuel.nourritureDemandee && !clientActuel.servi.nourriture) satisfactionScore -= 15;
  if (!clientActuel.servi.livre) satisfactionScore -= 10;
  setSatisfaction((s: number) => Math.max(0, Math.min(100, s + (satisfactionScore - 70) / 4)));
  log(`👋 ${clientActuel.nom} repart avec ${satisfactionScore}% de satisfaction.`);
  if (satisfactionScore >= 85) {
    log("🌟 Client très satisfait ! Bonus de réputation.");
    setReputation((r: number) => Math.min(5, r + 0.15));
  } else if (satisfactionScore >= 70) {
    setReputation((r: number) => Math.min(5, r + 0.05));
  } else if (satisfactionScore < 50) {
    log("😞 Client pas très content...");
    setReputation((r: number) => Math.max(1, r - 0.1));
  }
  setClientActuel(null);
}

export function handleClientLeave({
  clientActuel,
  setSatisfaction,
  log,
  setClientActuel
}: HandleClientLeaveProps) {
  if (!clientActuel) return;
  log(`😠 ${clientActuel.nom} repart mécontent par manque de patience...`);
  setSatisfaction((s: number) => Math.max(0, s - 15));
  setClientActuel(null);
}

export function restockBooks(inv: Inventaire): Inventaire {
  return {
    ...inv,
    livres: Object.fromEntries(
      Object.entries(inv.livres).map(([genre, nb]) => [genre, nb + Math.floor(Math.random() * 3) + 1])
    )
  };
}

export function handleClientAction({
  actionType,
  itemOrGenre,
  clientActuel,
  inventaire,
  setInventaire,
  setArgent,
  log,
  setClientActuel,
  clientParti
}: HandleClientActionProps) {
  if (!clientActuel) return;
  if (actionType === "livre") {
    const genre = itemOrGenre;
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
    setInventaire((inv: Inventaire) => ({
      ...inv,
      livres: { ...inv.livres, [genre]: inv.livres[genre] - 1 }
    }));
    setArgent((a: number) => Number((a + prixVente.livres).toFixed(2)));
    const estPrefere = genre === clientActuel.genreDemande;
    log(estPrefere ?
      `📖 Livre de ${genre} recommandé à ${clientActuel.nom} - Parfait ! (+${prixVente.livres}€)` :
      `📖 Livre de ${genre} recommandé à ${clientActuel.nom} - Ça ira (+${prixVente.livres}€)`
    );
    setClientActuel({
      ...clientActuel,
      servi: { ...clientActuel.servi, livre: true }
    });
  } else {
    const item = itemOrGenre;
    if ((inventaire as Record<string, number | typeof inventaire.livres>)[item] as number <= 0) {
      log(`❌ Plus de ${item} en stock !`);
      const newClient = { ...clientActuel, patienceRestante: clientActuel.patienceRestante - 1 };
      if (newClient.patienceRestante <= 0) {
        clientParti();
        return;
      }
      setClientActuel(newClient);
      return;
    }
    setInventaire((inv: Inventaire) => ({
      ...inv,
      [item]: (inv as Record<string, number | typeof inv.livres>)[item] as number - 1
    }));
    const prixItem = Number((prixVente as any)[item]) || 0;
    setArgent((a: number) => Number((a + prixItem).toFixed(2)));
    const estPrefere = (actionType === 'boisson' && item === clientActuel.boissonDemandee) ||
      (actionType === 'nourriture' && item === clientActuel.nourritureDemandee);
    log(estPrefere ?
      `✅ ${item} servi à ${clientActuel.nom} - Parfait ! (+${prixItem}€)` :
      `✅ ${item} servi à ${clientActuel.nom} - Ça ira (+${prixItem}€)`
    );
    setClientActuel({
      ...clientActuel,
      servi: { ...clientActuel.servi, [actionType]: true }
    });
  }
}

export function handlePurchase({
  type,
  produit,
  argent,
  setArgent,
  setInventaire,
  log
}: HandlePurchaseProps) {
  if (type === "livres") {
    const cost = prixAchat.livres;
    if (argent < cost) {
      log("❌ Pas assez d'argent pour acheter des livres !");
      return;
    }
    setArgent((a: number) => Number((a - cost).toFixed(2)));
    setInventaire(restockBooks);
    log("📚 Nouveaux livres achetés ! Stock de livres réapprovisionné.");
  } else {
    if (!produit) {
      log("❌ Aucun produit sélectionné !");
      return;
    }
    const prixProduit = Number((prixAchat as Record<string, number>)[produit]) || 0;
    if (argent < prixProduit) {
      log(`❌ Pas assez d'argent pour acheter un(e) ${produit} !`);
      return;
    }
    setArgent((a: number) => Number((a - prixProduit).toFixed(2)));
    setInventaire((inv: Inventaire) => ({
      ...inv,
      [produit]: (inv as Record<string, number | typeof inv.livres>)[produit] as number + 1
    }));
    log(`🛒 ${produit.charAt(0).toUpperCase() + produit.slice(1)} acheté(e) !`);
  }
}

export function genererNouvellesQuetes(objetsDebloques: {boissons: string[], nourritures: string[], genresLivres: string[]}): Quete[] {
  const typesQuetes = getTypesQuetes();
  const pool = typesQuetes.filter(q =>
    (q.type === "boisson" && objetsDebloques.boissons.includes(q.cible)) ||
    (q.type === "nourriture" && objetsDebloques.nourritures.includes(q.cible)) ||
    (q.type === "livre" && objetsDebloques.genresLivres.includes(q.cible))
  );

  const nb = Math.floor(Math.random() * 2) + 2;
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, nb).map(q => {
    const quantite = Math.floor(Math.random() * (q.max - q.min + 1)) + q.min;
    return { ...q, quantite, progression: 0, completee: false };
  });
}

export function verifierQuetes(quetes: Quete[], action: {type: string, cible: string}, log: (msg: string) => void): Quete[] {
  const nouvellesQuetes = quetes.map(q => {
    if (!q.completee && q.type === action.type && q.cible === action.cible) {
      const nouvelleProgression = q.progression + 1;
      if (nouvelleProgression >= q.quantite) {
        log(`🎉 Quête accomplie : ${q.description} (${q.quantite}/${q.quantite}) !`);
        return { ...q, progression: q.quantite, completee: true };
      } else {
        log(`Progression de la quête : ${q.description} (${nouvelleProgression}/${q.quantite})`);
        return { ...q, progression: nouvelleProgression };
      }
    }
    return q;
  });
  return nouvellesQuetes;
}

export function toutesQuetesCompletees(quetes: Quete[]): boolean {
  return quetes.every(q => q.completee);
}

export function donnerRecompense(
  objetsDebloques: { boissons: string[], nourritures: string[], genresLivres: string[] },
  setObjetsDebloques: React.Dispatch<React.SetStateAction<{ boissons: string[], nourritures: string[], genresLivres: string[] }>>,
  setInventaire: React.Dispatch<React.SetStateAction<Inventaire>>,
  setArgent: React.Dispatch<React.SetStateAction<number>>,
  log: (msg: string) => void
) {
  const nonDebloques = [
    ...allBoissons.filter(b => !objetsDebloques.boissons.includes(b)).map(b => ({ type: "boisson", nom: b })),
    ...allNourritures.filter(n => !objetsDebloques.nourritures.includes(n)).map(n => ({ type: "nourriture", nom: n })),
    ...allGenresLivres.filter(g => !objetsDebloques.genresLivres.includes(g)).map(g => ({ type: "livre", nom: g })),
  ];
  if (nonDebloques.length === 0) {
    setArgent((a: number) => a + 20);
    log("💰 Tous les objets sont débloqués ! Vous recevez 20€ à la place.");
    return;
  }
  const obj = nonDebloques[Math.floor(Math.random() * nonDebloques.length)];
  setObjetsDebloques((o: any) => {
    if (obj.type === "boisson") return { ...o, boissons: [...o.boissons, obj.nom] };
    if (obj.type === "nourriture") return { ...o, nourritures: [...o.nourritures, obj.nom] };
    if (obj.type === "livre") return { ...o, genresLivres: [...o.genresLivres, obj.nom] };
    return o;
  });
  setInventaire((inv: any) => {
    if (obj.type === "boisson") return { ...inv, [obj.nom]: ((inv as any)[obj.nom] || 0) + 1 };
    if (obj.type === "nourriture") return { ...inv, [obj.nom]: ((inv as any)[obj.nom] || 0) + 1 };
    if (obj.type === "livre") return { ...inv, livres: { ...inv.livres, [obj.nom]: (inv.livres[obj.nom] || 0) + 1 } };
    return inv;
  });
  log(`🔓 Nouveau produit débloqué : ${obj.nom} !`);
}