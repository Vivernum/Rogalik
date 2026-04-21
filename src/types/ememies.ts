import { GameObj, HealthComp, PosComp } from "kaplay";
import { TPlayer } from "./player";
import { AllDamageTypes, ResistanceType } from "./stats";

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
  attackStats: AllDamageTypes;
  resistanceStats: ResistanceType;
  attackDuration: number;
  action: EnemyActionsPull;
}

export type TShriker = GameObj<PosComp | HealthComp | EnemyComp>;
