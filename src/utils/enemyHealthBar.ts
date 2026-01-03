import { GameObj, KAPLAYCtxT } from "kaplay";


export function createHelthBar(k: KAPLAYCtxT, enemy: GameObj) {
  const healthBar = enemy.add([
    k.rect(60, 10, {
      radius: 10,
      fill: false,
    }),
    k.pos(k.vec2(-55, -40)),
    k.outline(3, k.BLACK),
  ]);

  const healthBarFill = healthBar.add([
    k.rect(60, 10, {
      radius: 10,
    }),
    k.pos(k.vec2(0, 0)),
    k.opacity(0.5),
    k.color(k.RED),
  ]);

  return [healthBar, healthBarFill];
}