import { Vec2 } from "kaplay";
import { PartialPlayersAttackStatsType, PlayersAtackStatsType } from "./stats";
import { EnemyEffectPayloadType } from "./effect";

export interface IWeapon {
  firingRate: number;
  timePassedSinceLastShot: number;
  damage: PartialPlayersAttackStatsType;
  effectPayload: EnemyEffectPayloadType;
  takeShot: (
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersAtackStatsType,
  ) => void;
}
