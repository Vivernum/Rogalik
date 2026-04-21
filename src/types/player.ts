import { GameObj, PosComp, HealthComp, AreaComp } from "kaplay";
import { AllDamageTypes } from "./stats";

export interface IPlayerEnemyActions {
  damageHandler: (attackStats: AllDamageTypes) => void;
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
