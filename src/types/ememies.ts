import { GameObj, HealthComp, PosComp } from "kaplay";
import { TPlayer } from "./player";
import {
  IEnemyAttackStatsController,
  IPlayersAttackStatsController,
  IResistanceStatsController,
} from "./controllers";
import { EffectsType, EnemyUseEffectCallbackType, IEffectController } from "./effect";
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
  takeDamage: (damage: PartialAllAttackStatsType, callbackFn: EnemyUseEffectCallbackType, effectType: EffectsType) => void;
}

export type TShriker = GameObj<PosComp | HealthComp | EnemyComp>;
