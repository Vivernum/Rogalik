import { Vec2 } from "kaplay";
import { AllDamageTypes, PlayersStatsType } from "./stats";

export interface IWeapon {
  firingRate: number;
  timePassedSinceLastShot: number;
  damage: Partial<AllDamageTypes>;
  takeShot: (
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersStatsType,
  ) => void;
}
