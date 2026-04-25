import { Vec2 } from "kaplay";
import { PartialPlayersAttackStatsType, PlayersAtackStatsType } from "./stats";
import { EffectPayloadType } from "./effect";

export interface IWeapon {
  firingRate: number;
  timePassedSinceLastShot: number;
  damage: PartialPlayersAttackStatsType;
  effectPayload: EffectPayloadType;
  takeShot: (
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersAtackStatsType,
  ) => void;
}
