import { KAPLAYCtxT } from "kaplay";
import { IPlayerWeaponActions } from "../Entities/CPlayer";
import { Ak } from "./CAk";
import { Bazooka } from "./CBazooka";
import { TWeapon } from "./CWeapon";
import { Kolt } from "./CKolt";


export class WeaponProvider {
  constructor(
    protected k: KAPLAYCtxT,
  ) {
    k.loadSprite("ak", "sprites/Weapons/ak.png");
    k.loadSprite("bazooka", "sprites/Weapons/bazooka.png");
    k.loadSprite("kolt", "sprites/Weapons/kolt.png");
  };

  getAk(pos: number[], playerIn: IPlayerWeaponActions): TWeapon {
    const ak = new Ak(this.k, pos, playerIn);
    return ak.getWeapon();
  };

  getBazooka(pos: number[], playerIn: IPlayerWeaponActions): TWeapon {
    const bazooka = new Bazooka(this.k, pos, playerIn);
    return bazooka.getWeapon();
  };

  getKolt(pos: number[], playerIn: IPlayerWeaponActions): TWeapon {
    const kolt = new Kolt(this.k, pos, playerIn);
    return kolt.getWeapon();
  };
};