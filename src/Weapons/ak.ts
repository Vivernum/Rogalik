import { GameObj, KAPLAYCtxT } from "kaplay";
import { createProjectile } from './Bullets/projectile';

export function createAk(k: KAPLAYCtxT) {
  k.loadSprite("ak", "sprites/Weapons/ak.png");
  k.loadSprite("hexagon", "sprites/Textures/hexagon.png");

  const gun = k.add([
    k.sprite("ak"),
    k.area(),
    k.rotate(0),
    k.pos(330,200),
    k.anchor(k.vec2(-1, 0)),
    'weapon',
    {
      isEquipped: false,
      owner: null,
      shotsCount: 0,

      equip(player: GameObj) {
        if(this.isEquipped) return;
        
        this.use(k.follow(player));
        this.isEquipped = true;
        this.onwer = player;

        this.trigger('equipped', {player});
      },

      // might as well use onUpdate, but with cam following
      // player there is no real need for onUpdate
      addMouseTracking(player: GameObj) {
        let gunAngle: number | null = null;
        let damageTimer = 0.3;

        this.onUpdate(() => {
          if (!this.isEquipped) return;
          damageTimer += k.dt();
        });

        this.onMouseMove(() => {
          if (!this.isEquipped) return;
          gunAngle = k.toWorld(k.mousePos()).sub(player.pos).angle();
          this.angle = gunAngle;
          this.flipY = Math.abs(this.angle) > 90;
        });
        
        this.onMouseDown(() => {
          if (!this.isEquipped) return;
          if(damageTimer >= 0.3) {
            damageTimer = 0;
            if (this.shotsCount === 0) {
              const dir = k.toWorld(k.mousePos()).sub(player.pos).unit().scale(2000);
              createProjectile(k, this, dir, gunAngle, 20);
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
        this.owner = null;
        this.unuse('follow');
        Math.abs(this.angle) > 90 ? this.angle = 180 : this.angle = 0;
      },
    },

  ]);

  gun.onCollide('player', (player: GameObj) => {
    gun.onKeyDown('f', () => {
      gun.equip(player);
      gun.addMouseTracking(player);
    });

    gun.onKeyDown('q', () => {
      gun.unEquip();
    })
  });

  return gun;
};