import { GameObj, KAPLAYCtxT } from "kaplay";
import { createProjectile } from './Bullets/projectile';

export function createAk(k: KAPLAYCtxT, player: GameObj) {
  k.loadSprite("ak", "sprites/Weapons/ak.png");
  k.loadSprite("hexagon", "sprites/Textures/hexagon.png");

  const gun = k.add([
    k.sprite("ak"),
    k.area(),
    k.rotate(0),
    k.pos(330,200),
    k.anchor(k.vec2(-1,0)),
    'weapon',
    {
      isEquipped: false,
      owner: null,

      equip(player: GameObj) {
        if(this.isEquipped) return;

        this.use(k.follow(player));

        this.trigger('equipped', {player});
      },

      // might as well use onUpdate, but with cam following
      // player there is no real need for onUpdate
      addMouseTracking(player: GameObj) {
        let gunAngle: number | null = null;
        let damageTimer = 0.3;

        gun.onUpdate(() => {
          damageTimer += k.dt();
        });

        gun.onMouseMove(() => {
          gunAngle = k.toWorld(k.mousePos()).sub(player.pos).angle();
          gun.angle = gunAngle;
          gun.flipY = Math.abs(gun.angle) > 90;
        });
        
        gun.onMouseDown(() => {
          if(damageTimer > 0.3) {
            damageTimer = 0;
            const dir = k.toWorld(k.mousePos()).sub(player.pos).unit().scale(2000);
            const projectile = createProjectile(k, gun, dir, gunAngle);
          };
        });

      },
    },
  ]);

  gun.onCollide('player', (player) => {
    gun.onKeyDown('f', () => {
      gun.equip(player);
      gun.addMouseTracking(player);
    })
  });
  

  return gun;
};