import { KAPLAYCtxT, GameObj, AnchorComp, AreaComp, PosComp, RotateComp } from "kaplay";
import { IPlayer } from "../Entities/CPlayer";
import { createProjectile } from "./Bullets/projectile";

export interface IAk {
  isEquipped: boolean,
  isPickable: boolean,
  shotsCount: number,
  baseDamage: number,
  firingFrequency: number,
};

export type TAk = GameObj<PosComp | AreaComp | AnchorComp| RotateComp | IAk>;

export class Ak {
  protected gun: TAk;

  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected playerIn: IPlayer,
  ) {
    k.loadSprite("ak", "sprites/Weapons/ak.png");

    this.gun =k.add([
      k.sprite("ak"),
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
        baseDamage: 20,
        firingFrequency: 0.3,

        add() {
          this.onUpdate(() => {
            if (!this.isEquipped) return;
            this.firingFrequency += k.dt();
          });

          this.onMouseMove(() => {
            if (!this.isEquipped) return;
            this.angle = k.toWorld(k.mousePos()).sub(playerIn.player.pos).angle();
            this.flipY = Math.abs(this.angle) > 90;
          });

          this.onMouseDown(() => {
            if (!this.isEquipped) return;
            if(this.firingFrequency >= 0.3) {
              this.firingFrequency = 0;
              if (this.shotsCount === 0) {
                const dir = k.toWorld(k.mousePos()).sub(playerIn.player.pos).unit().scale(2000);
                createProjectile(k, this, dir, this.angle, this.baseDamage);
                this.shotsCount++;
              }
            } else {
              this.shotsCount = 0;
            }
          });
        },

      },
    ]);

    this.gun.onCollide('player', () => {
      this.gun.isPickable = true;
    });
  
    this.gun.onCollideEnd('player', () => {
      this.gun.isPickable = false;
    });

    this.gun.onKeyPress('f', () => {
      if (this.gun.isPickable) {
        this.playerIn.equipWeapon(this.gun);
      };
    });

    this.gun.onKeyPress('q', () => {
      if (this.gun.isEquipped) {
        this.playerIn.unEquipWeapon();
      }
    });

  }
}