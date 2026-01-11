import { KAPLAYCtxT } from "kaplay";
import { IPlayerWeaponActions } from "../Entities/CPlayer";
import { Weapon } from "./CWeapon";

export class Kolt extends Weapon {
  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected playerIn: IPlayerWeaponActions,
    protected baseDamage: number = 10,
    protected firingFrequency: number = 0.7,
    protected weaponSprite: string = 'kolt',
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