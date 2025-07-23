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
