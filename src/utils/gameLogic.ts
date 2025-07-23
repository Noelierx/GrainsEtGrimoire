import { ClientType, ClientActuel, Inventaire, HandleEndServiceProps, HandleClientLeaveProps, HandleClientActionProps, HandlePurchaseProps } from "../types";
import { prix } from "../constants";

export function getRandomClient(typesClients: ClientType[]): ClientActuel {
  const clientType = typesClients[Math.floor(Math.random() * typesClients.length)];
  const boissonChoisie = clientType.boissons[Math.floor(Math.random() * clientType.boissons.length)];
  const nourritureChoisie = clientType.nourritures.length > 0 ?
    clientType.nourritures[Math.floor(Math.random() * clientType.nourritures.length)] : null;
  const genreChoisie = clientType.genresLivres[Math.floor(Math.random() * clientType.genresLivres.length)];
  return {
    ...clientType,
    boissonDemandee: boissonChoisie,
    nourritureDemandee: nourritureChoisie,
    genreDemande: genreChoisie,
    patienceRestante: clientType.patience,
    servi: { boisson: false, nourriture: false, livre: false }
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

export function restockInventory(inv: Inventaire, jour: number): Inventaire {
  return {
    ...inv,
    cafe: inv.cafe + Math.max(1, 3 - Math.floor(jour / 10)),
    the: inv.the + Math.max(1, 2 - Math.floor(jour / 15)),
    chocolat: inv.chocolat + 1,
    croissant: inv.croissant + Math.max(1, 2 - Math.floor(jour / 12)),
    muffin: inv.muffin + 1
  };
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
    setArgent((a: number) => Number((a + prix.livres).toFixed(2)));
    const estPrefere = genre === clientActuel.genreDemande;
    log(estPrefere ?
      `📖 Livre de ${genre} recommandé à ${clientActuel.nom} - Parfait ! (+${prix.livres}€)` :
      `📖 Livre de ${genre} recommandé à ${clientActuel.nom} - Ça ira (+${prix.livres}€)`
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
    const prixItem = Number((prix as any)[item]) || 0;
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
  inventaire,
  setInventaire,
  log
}: HandlePurchaseProps) {
  if (type === "livres") {
    const cost = 20;
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
    const prixProduit = Number((prix as Record<string, number>)[produit]) || 0;
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