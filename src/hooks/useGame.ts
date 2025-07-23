import { useState, useRef, useEffect } from "react";
import { Inventaire, ClientActuel } from "../types";
import { typesClients } from "../constants";
import {
  getRandomClient,
  handleEndService,
  handleClientLeave,
  handleClientAction,
  handlePurchase
} from "../utils/gameLogic";

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
    const nouveau = getRandomClient(typesClients);
    setClientActuel(nouveau);
    log(`👋 ${nouveau.nom} entre dans le café.`);
  };

  const servir = (item: string, type: "boisson" | "nourriture") => {
    handleClientAction({
      actionType: type,
      itemOrGenre: item,
      clientActuel,
      inventaire,
      setInventaire,
      setArgent,
      log,
      setClientActuel,
      clientParti
    });
  };

  const recommanderLivre = (genre: string) => {
    handleClientAction({
      actionType: "livre",
      itemOrGenre: genre,
      clientActuel,
      inventaire,
      setInventaire,
      setArgent,
      log,
      setClientActuel,
      clientParti
    });
  };

  const terminerService = () => {
    handleEndService({
      clientActuel,
      setSatisfaction,
      setReputation,
      log,
      setClientActuel
    });
  };

  function clientParti() {
    handleClientLeave({
      clientActuel,
      setSatisfaction,
      log,
      setClientActuel
    });
  }

  const passerJour = () => {
    setJour(j => j + 1);
    log(`🌅 Jour ${jour + 1} commence ! La difficulté augmente...`);
  };

  const acheterLivres = () => {
    handlePurchase({
      type: "livres",
      argent,
      setArgent,
      inventaire,
      setInventaire,
      log
    });
  };

  const acheterProduit = (produit: string) => {
    handlePurchase({
      type: "produit",
      produit,
      argent,
      setArgent,
      inventaire,
      setInventaire,
      log
    });
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