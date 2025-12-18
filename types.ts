
export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface OrnamentData {
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  color: string;
  weight: number; // For push physics
  scale: number;
}
