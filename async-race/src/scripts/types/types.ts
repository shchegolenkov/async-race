export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnersRequest {
  page: number;
  limit: number;
  sort: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface GaragePageState {
  carsOnPage: number;
  currentGaragePage: number;
  isLastGaragePage: boolean;
}

export type Listener = (...args: string[]) => void;
