import { KAPLAYCtxT } from "kaplay";
import { IPlayerWeaponActions } from "../types/player";
import { Weapon } from "./CWeapon";

export class Ak extends Weapon {
  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected playerIn: IPlayerWeaponActions,
    protected baseDamage: number = 15,
    protected firingFrequency: number = 0.3,
    protected weaponSprite: string = 'ak',
  ) {
    super(
      k,
      pos,
      playerIn,
      baseDamage,
      firingFrequency,
      weaponSprite,
    );
  };
};