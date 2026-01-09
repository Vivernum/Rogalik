import { AreaComp, GameObj, KAPLAYCtxT, PosComp } from "kaplay";
import { createProjectile } from './Bullets/projectile';
import { TPlayer } from "../Entities/CPlayer";

export interface IAk {
  isEquipped: boolean,
  isPickable: boolean,
  owner: null | TPlayer,
  shotsCount: number,
  baseDamage: number,
};

export type TAk = GameObj<PosComp | AreaComp | IAk>;

export function createAk(k: KAPLAYCtxT) {
  k.loadSprite("ak", "sprites/Weapons/ak.png");

  const gun = k.add([
    k.sprite("ak"),
    k.area({
      shape: new k.Rect(k.vec2(0.0), 50, 20),
    }),
    k.rotate(0),
    k.pos(330,200),
    k.stay(),
    k.anchor('center'),
    'weapon',
    'item',
    {
      isEquipped: false,
      isPickable: false,
      owner: null,
      shotsCount: 0,
      baseDamage: 20,

      equip(player: TPlayer) {
        if(this.isEquipped) return;
        
        this.use(k.follow(player));
        gun.anchor = k.vec2(-1, 0);
        this.isEquipped = true;
      },

      // might as well use onUpdate, but with cam following
      // player there is no real need for onUpdate
      add() {
        let gunAngle: number | null = null;
        let damageTimer = 0.3;

        this.onUpdate(() => {
          if (!this.isEquipped) return;
          damageTimer += k.dt();
        });

        this.onMouseMove(() => {
          if (!this.isEquipped) return;
          gunAngle = k.toWorld(k.mousePos()).sub(this.owner.pos).angle();
          this.angle = gunAngle;
          this.flipY = Math.abs(this.angle) > 90;
        });
        
        this.onMouseDown(() => {
          if (!this.isEquipped) return;
          if(damageTimer >= 0.3) {
            damageTimer = 0;
            if (this.shotsCount === 0) {
              const dir = k.toWorld(k.mousePos()).sub(this.owner.pos).unit().scale(2000);
              createProjectile(k, this, dir, gunAngle, this.baseDamage);
              this.shotsCount++;
            }
          } else {
            this.shotsCount = 0;
          }
        });

      },
      
      unEquip() {
        if (!this.isEquipped) return;
        this.isEquipped = false;
        this.unuse('follow');
        this.anchor = 'center';
        Math.abs(this.angle) > 90 ? this.angle = 180 : this.angle = 0;
      },
    },

  ]);

  // FIXME: нужно будет убрать функционал подбора игроку
  gun.onCollide('player', (player: TPlayer) => {
    gun.isPickable = true;
    gun.owner = player;
    gun.owner.onDestroy(() => {
      gun.unEquip();
    });
  });
  
  gun.onCollideEnd('player', () => {
    gun.isPickable = false;
    // gun.owner = null;
  });

  gun.onKeyPress('f', () => {
    if (gun.isPickable) {
      gun.equip(gun.owner);
      // gun.addMouseTracking(gun.owner);
    };
  });

  gun.onKeyPress('q', () => {
    gun.unEquip();
  });

  return gun;
};