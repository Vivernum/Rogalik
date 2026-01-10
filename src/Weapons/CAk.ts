import { KAPLAYCtxT, GameObj, AnchorComp, AreaComp, PosComp, RotateComp, SpriteComp } from "kaplay";
import { IPlayerWeaponActions } from "../Entities/CPlayer";
import { createProjectile } from "./Bullets/projectile";
import { Weapon } from "./CWeapon";

export class Ak extends Weapon{
  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected playerIn: IPlayerWeaponActions,
    protected baseDamage: number = 10,
    protected firingFrequency: number = 0.5,
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