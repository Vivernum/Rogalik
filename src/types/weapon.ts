import { Vec2 } from "kaplay";
import { PartialPlayersAttackStatsType, PlayersAtackStatsType } from "./stats";
import { EffectCallbackResultType } from "./effect";
import { EnemyComp } from "./ememies";

export interface IWeapon {
  firingRate: number;
  timePassedSinceLastShot: number;
  damage: PartialPlayersAttackStatsType;
  effectCallback: (entity: EnemyComp) => EffectCallbackResultType;
  takeShot: (
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersAtackStatsType,
  ) => void;
}
