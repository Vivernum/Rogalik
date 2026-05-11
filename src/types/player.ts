import { GameObj, PosComp, HealthComp, AreaComp } from "kaplay";
import { PartialEnemyAttackStatsType } from "./stats";
import { IWeapon } from "./weapon";
import {
  IPlayersAttackStatsController,
  IResistanceStatsController,
} from "./controllers";
import { IPlayerEffectController, PlayerEffectPayloadType } from "./effect";

export interface IPlayerEnemyActions {
  damageHandler: (attackStats: PartialEnemyAttackStatsType, effectPayload?: PlayerEffectPayloadType) => void;
}

export interface IPlayerWeaponActions {
  player: TPlayer;
}

export interface IHealthPlayerComp {
  player: TPlayer;
}

export type TPlayer = GameObj<PosComp | HealthComp | AreaComp>;

export interface IPlayer {
  player: TPlayer;
  maxHealth: number;
  hitCooldown: number;
  timePassedSinceLastHit: number;
  speed: number;
  equipedWeapon: IWeapon;
  attackStatsController: IPlayersAttackStatsController;
  resistanceStatsController: IResistanceStatsController;
  effectsController: IPlayerEffectController;
}
