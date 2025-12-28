import { GameObj, KAPLAYCtxT } from "kaplay";

export function createAk(k: KAPLAYCtxT, player: GameObj) {
  k.loadSprite("ak", "sprites/Weapons/ak.png");

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
        gun.onMouseMove(() => {
          gun.angle = k.toWorld(k.mousePos()).sub(player.pos).angle();
          gun.flipY = Math.abs(gun.angle) > 90;
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