import React from "react";

export type GenreLivre = "Roman" | "Science-Fiction" | "Polar" | "Philosophie" | "Cuisine";
export type Boisson = "cafe" | "the" | "chocolat";
export type Nourriture = "croissant" | "muffin";

export interface InventaireLivres {
  [genre: string]: number;
}

export interface Inventaire {
  cafe: number;
  the: number;
  chocolat: number;
  croissant: number;
  muffin: number;
  livres: InventaireLivres;
  [key: string]: number | InventaireLivres;
}

export interface ClientType {
  nom: string;
  boissons: string[];
  nourritures: string[];
  genresLivres: string[];
  patience: number;
  budget: number;
  description: string;
}
export interface ClientActuel extends ClientType {
  boissonDemandee: string;
  nourritureDemandee: string | null;
  genreDemande: string;
  patienceRestante: number;
  servi: { boisson: boolean; nourriture: boolean; livre: boolean };
}
export interface StatsProps {
  argent: number;
  satisfaction: number;
  reputation: number;
  jour: number;
}

export interface HandleEndServiceProps {
  clientActuel: ClientActuel | null;
  setSatisfaction: React.Dispatch<React.SetStateAction<number>>;
  setReputation: React.Dispatch<React.SetStateAction<number>>;
  log: (message: string) => void;
  setClientActuel: React.Dispatch<React.SetStateAction<ClientActuel | null>>;
}

export interface HandleClientLeaveProps {
  clientActuel: ClientActuel | null;
  setSatisfaction: React.Dispatch<React.SetStateAction<number>>;
  log: (message: string) => void;
  setClientActuel: React.Dispatch<React.SetStateAction<ClientActuel | null>>;
}

export interface HandleClientActionProps {
  actionType: "boisson" | "nourriture" | "livre";
  itemOrGenre: string;
  clientActuel: ClientActuel | null;
  inventaire: Inventaire;
  setInventaire: React.Dispatch<React.SetStateAction<Inventaire>>;
  setArgent: React.Dispatch<React.SetStateAction<number>>;
  log: (message: string) => void;
  setClientActuel: React.Dispatch<React.SetStateAction<ClientActuel | null>>;
  clientParti: () => void;
}

export interface HandlePurchaseProps {
  type: "livres" | "produit";
  produit?: string;
  argent: number;
  setArgent: React.Dispatch<React.SetStateAction<number>>;
  inventaire: Inventaire;
  setInventaire: React.Dispatch<React.SetStateAction<Inventaire>>;
  log: (message: string) => void;
}
