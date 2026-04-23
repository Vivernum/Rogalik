import { GameObj, HealthComp, PosComp } from "kaplay";
import { TPlayer } from "./player";
import {
  IEnemyAttackStatsController,
  IPlayersAttackStatsController,
  IResistanceStatsController,
} from "./controllers";

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
  attackDuration: number;
  action: EnemyActionsPull;
}

export type TShriker = GameObj<PosComp | HealthComp | EnemyComp>;
