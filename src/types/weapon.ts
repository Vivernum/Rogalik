import { Vec2 } from "kaplay";
import { PartialPlayersAttackStatsType, PlayersAtackStatsType } from "./stats";

export interface IWeapon {
  firingRate: number;
  timePassedSinceLastShot: number;
  damage: PartialPlayersAttackStatsType;
  takeShot: (
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersAtackStatsType,
  ) => void;
}
