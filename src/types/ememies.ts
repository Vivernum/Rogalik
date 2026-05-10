import { GameObj, HealthComp, PosComp } from "kaplay";
import { TPlayer } from "./player";
import {
  IEnemyAttackStatsController,
  IPlayersAttackStatsController,
  IResistanceStatsController,
} from "./controllers";
import { EffectPayloadType, EffectsType, EnemyUseEffectCallbackType, IEffectController } from "./effect";
import { PartialAllAttackStatsType } from "./stats";

export enum EnemyActionsPull {
  Attack,
  Patrol,
  Pursuit,
}

export interface EnemyComp {
  speed: number;
  prey: TPlayer | null;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  attackStatsController: IEnemyAttackStatsController;
  resistanceStatsController: IResistanceStatsController;
  effectsController: IEffectController;
  attackDuration: number;
  action: EnemyActionsPull;
  takeDamage: (damage: PartialAllAttackStatsType, effectPayload?: EffectPayloadType) => void;
}

export type TShriker = GameObj<PosComp | HealthComp | EnemyComp>;
