import { Vec2 } from "kaplay";

export interface IWeapon {
  firingRate: number,
  timePassedSinceLastShot: number,
  damage: number;
  takeShot: (pos: Vec2, dir: Vec2, angle: number) => void,
};