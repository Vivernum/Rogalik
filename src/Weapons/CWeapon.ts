import { GameObj, PosComp, AreaComp, AnchorComp, RotateComp, KAPLAYCtxT, SpriteComp } from 'kaplay';
import { IPlayerWeaponActions } from '../Entities/CPlayer';
import { createProjectile } from './Bullets/projectile';

export interface IWeapon {
  isEquipped: boolean,
  isPickable: boolean,
  shotsCount: number,
  baseDamage: number,
  firingFrequency: number,
  firingTempCount: number,
};

export type TWeapon = GameObj<PosComp | AreaComp | AnchorComp | RotateComp | SpriteComp | IWeapon>;

export abstract class Weapon {
  protected weapon: TWeapon;

  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected playerIn: IPlayerWeaponActions,
    protected baseDamage: number = 10,
    protected firingFrequency: number = 0.5,
    protected weaponSprite: string = 'ak',
  ) {

    this.weapon = k.add([
      k.sprite(weaponSprite),
      k.area({
        shape: new k.Rect(k.vec2(0.0), 30, 15),
      }),
      k.rotate(0),
      k.pos(pos[0], pos[1]),
      k.stay(),
      k.anchor('center'),
      'weapon',
      'item',
      {
        isEquipped: false,
        isPickable: false,
        shotsCount: 0,
        baseDamage: baseDamage,
        firingFrequency: firingFrequency,
        firingTempCount: firingFrequency,
      },
    ]);

    this.weapon.onUpdate(() => {
      if (!this.weapon.isEquipped) return;
      this.weapon.firingTempCount += k.dt();
    });

    this.weapon.onMouseMove(() => {
      if (!this.weapon.isEquipped) return;
      this.weapon.angle = k.toWorld(k.mousePos()).sub(playerIn.player.pos).angle();
      this.weapon.flipY = Math.abs(this.weapon.angle) > 90;
    });

    this.weapon.onMouseDown(() => {
      if (!this.weapon.isEquipped) return;
      if(this.weapon.firingTempCount >= this.weapon.firingFrequency) {
        this.weapon.firingTempCount = 0;
        if (this.weapon.shotsCount === 0) {
          const dir = k.toWorld(k.mousePos()).sub(playerIn.player.pos).unit().scale(2000);
          createProjectile(k, this.weapon, dir, this.weapon.angle, this.weapon.baseDamage);
          this.weapon.shotsCount++;
        }
      } else {
        this.weapon.shotsCount = 0;
      }
    });

    this.weapon.onCollide('player', () => {
      this.weapon.isPickable = true;
    });
  
    this.weapon.onCollideEnd('player', () => {
      this.weapon.isPickable = false;
    });

    this.weapon.onKeyPress('f', () => {
      if (this.weapon.isPickable) {
        this.playerIn.equipWeapon(this.weapon);
      };
    });

    this.weapon.onKeyPress('q', () => {
      if (this.weapon.isEquipped) {
        this.playerIn.unEquipWeapon();
      }
    });

  };
};