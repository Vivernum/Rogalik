import { TWeapon } from "../Weapons/CWeapon";
import { GameObj, PosComp, HealthComp, AreaComp } from "kaplay";

export interface IPlayerEnemyActions {
  damageHandler: (damage: number) => void,
};

export interface IPlayerWeaponActions {
  player: TPlayer,
  // equipWeapon: (weapon: TWeapon) => void,
  // unEquipWeapon: () => void,
};

export interface IHealthPlayerComp {
  player: TPlayer,
};

export type TPlayer = GameObj<PosComp | HealthComp | AreaComp>;