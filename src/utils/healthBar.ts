import { GameObj, KAPLAYCtxT, Vec2 } from "kaplay";


export function createHelthBar(k: KAPLAYCtxT, entity: GameObj, pos: Vec2) {
  const healthBar = entity.add([
    k.rect(40, 10, {
      radius: 10,
      fill: false,
    }),
    k.anchor("center"),
    k.pos(pos),
    k.outline(3, k.BLACK),
    k.z(1),
  ]);

  const healthBarFill = healthBar.add([
    k.rect(40, 10, {
      radius: 10,
    }),
    k.pos(k.vec2(-20, -5)),
    k.opacity(0.5),
    k.color(k.RED),
    k.z(1),
  ]);

  return  healthBarFill;
}