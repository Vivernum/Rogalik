import { KAPLAYCtxT, GameObj, Vec2 } from "kaplay";
import { createParticles } from "../../utils/collisionParticles";

export function createProjectile(k: KAPLAYCtxT, gun: GameObj, dir: Vec2, rotation: number, damage: number) {
  k.loadSprite('projectile', 'sprites/Weapons/projectile.png');
  k.loadSprite('hexagon', 'sprites/Textures/hexagon.png');

  const projectile = k.add([
    k.sprite('projectile'),
    k.pos(gun.pos),
    k.area(),
    k.move(dir, 400),
    k.offscreen({ destroy: true}),
    k.rotate(rotation),
    k.anchor(k.vec2(-5, Math.abs(gun.angle) > 90 ? -1 : 1)),
    {
      damage: damage,
    },
    'projectile',
  ]);

  projectile.onCollide((obj: GameObj) => {
    if (obj.tags.includes('enemy')) {
      obj.hp -= damage;
      projectile.destroy();
    };
    if(obj.tags.includes('wall')) {
      projectile.destroy();
    };
  });

  projectile.onDestroy(() => {

    createParticles(k, projectile.pos, dir, 15);
    // const splatter = k.add([
    //   k.particles({
    //     max: 5,
    //     speed: [300, 350],
    //     lifeTime: [0.3, 0.5],
    //     colors: [k.WHITE],
    //     opacities: [1.0, 0.0],
    //     angle: [0, 180],
    //     texture: k.getSprite('hexagon').data.tex,
    //     quads: [k.getSprite('hexagon').data.frames[0]],
    //   }, {
    //     position:projectile.pos,
    //     lifetime: 0.5,
    //     rate: 0,
    //     direction: dir.scale(-1).angle(),
    //     spread: 30,
    //   }),
    // ]);
    // splatter.emit(10);
    // splatter.onEnd(() => {
    //   k.destroy(splatter);
    // });
  });

  return projectile;
}