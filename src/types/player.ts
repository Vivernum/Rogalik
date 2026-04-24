import { GameObj, PosComp, HealthComp, AreaComp } from "kaplay";
import { PartialEnemyAttackStatsType } from "./stats";
import { IWeapon } from "./weapon";
import {
  IPlayersAttackStatsController,
  IResistanceStatsController,
} from "./controllers";

export interface IPlayerEnemyActions {
  damageHandler: (attackStats: PartialEnemyAttackStatsType) => void;
}

export interface IPlayerWeaponActions {
  player: TPlayer;
  // equipWeapon: (weapon: TWeapon) => void,
  // unEquipWeapon: () => void,
}

export interface IHealthPlayerComp {
  player: TPlayer;
}

export type TPlayer = GameObj<PosComp | HealthComp | AreaComp>;

export interface IPlayer {
  player: TPlayer;
  hitCooldown: number;
  timePassedSinceLastHit: number;
  speed: number;
  equipedWeapon: IWeapon;
  attackStatsController: IPlayersAttackStatsController;
  resistanceStatsController: IResistanceStatsController;
}
