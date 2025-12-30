import { KAPLAYCtxT, GameObj, Vec2 } from "kaplay";

export function createProjectile(k: KAPLAYCtxT, gun: GameObj, dir: Vec2, rotation: number) {
  k.loadSprite('projectile', 'sprites/Weapons/projectile.png');

  const projectile = k.add([
    k.sprite('projectile'),
    k.pos(gun.pos),
    k.area(),
    k.move(dir, 400),
    k.offscreen({ destroy: true}),
    k.rotate(rotation),
    k.anchor(k.vec2(-5, Math.abs(gun.angle) > 90 ? -1 : 1)),
  ]);

  return projectile;
}