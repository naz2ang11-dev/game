export type Team = 'RED' | 'BLUE' | null;

export enum GameMode {
  SEQUENTIAL = 'SEQUENTIAL',
  RANDOM = 'RANDOM',
}

export interface HistoryItem {
  id: string;
  team: Team;
  turnNumber: number;
}
