import { Color, KAPLAYCtxT, Vec2 } from "kaplay";

export function createCircularParticles(k: KAPLAYCtxT, pos: Vec2, radius: number, count: number = 20,  color: Color = k.RED) {

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;

    const x = pos.x + radius * Math.cos(angle);
    const y = pos.y + radius * Math.sin(angle);
    k.add([
      k.pos(x, y),
      k.rect(3, 3),
      k.color(color),
      k.opacity(k.rand(0.5, 1)),
      k.lifespan(k.rand(0.1, 0.2)),
      k.move(k.rand(k.vec2(-25, 25), k.vec2(25, -25)).angle(), k.rand(k.vec2(-10, -10), k.vec2(10, 10)).angle()),
    ]);
  };
}