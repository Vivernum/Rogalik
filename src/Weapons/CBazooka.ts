import { KAPLAYCtxT } from "kaplay";
import { IPlayerWeaponActions } from "../Entities/CPlayer";
import { Weapon } from "./CWeapon";

export class Bazooka extends Weapon {
  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected playerIn: IPlayerWeaponActions,
    protected baseDamage: number = 50,
    protected firingFrequency: number = 1,
    protected weaponSprite: string = 'bazooka',
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