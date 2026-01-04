import { GameObj, KAPLAYCtxT, Vec2 } from "kaplay";


export function createHelthBar(k: KAPLAYCtxT, enemy: GameObj, pos: Vec2) {
  const healthBar = enemy.add([
    k.rect(60, 10, {
      radius: 10,
      fill: false,
    }),
    k.anchor("center"),
    k.pos(pos),
    k.outline(3, k.BLACK),
  ]);

  const healthBarFill = healthBar.add([
    k.rect(60, 10, {
      radius: 10,
    }),
    k.pos(k.vec2(-30, -5)),
    k.opacity(0.5),
    k.color(k.RED),
  ]);

  return  healthBarFill;
}