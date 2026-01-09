import { KAPLAYCtxT, GameObj, AnchorComp, AreaComp, PosComp, RotateComp } from "kaplay";
import { IPlayer } from "../Entities/CPlayer";
import { createProjectile } from "./Bullets/projectile";

export interface IAk {
  isEquipped: boolean,
  isPickable: boolean,
  shotsCount: number,
  baseDamage: number,
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
        shape: new k.Rect(k.vec2(0.0), 50, 20),
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

        add() {
          let gunAngle: number | null = null;
          let damageTimer = 0.3;

          this.onUpdate(() => {
            if (!this.isEquipped) return;
            damageTimer += k.dt();
          });

          this.onMouseMove(() => {
            if (!this.isEquipped) return;
            gunAngle = k.toWorld(k.mousePos()).sub(playerIn.player.pos).angle();
            this.angle = gunAngle;
            this.flipY = Math.abs(this.angle) > 90;
          });

          this.onMouseDown(() => {
            if (!this.isEquipped) return;
            if(damageTimer >= 0.3) {
              damageTimer = 0;
              if (this.shotsCount === 0) {
                const dir = k.toWorld(k.mousePos()).sub(playerIn.player.pos).unit().scale(2000);
                createProjectile(k, this, dir, gunAngle, this.baseDamage);
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