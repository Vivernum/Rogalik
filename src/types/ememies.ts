import { GameObj, HealthComp, PosComp } from "kaplay";
import { TPlayer } from "./player";
import {
  IEnemyAttackStatsController,
  IResistanceStatsController,
} from "./controllers";
import { EnemyEffectPayloadType, IEnemyEffectController } from "./effect";
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
  effectsController: IEnemyEffectController;
  attackDuration: number;
  action: EnemyActionsPull;
  takeDamage: (damage: PartialAllAttackStatsType, effectPayload?: EnemyEffectPayloadType) => void;
}

export type TShriker = GameObj<PosComp | HealthComp | EnemyComp>;
