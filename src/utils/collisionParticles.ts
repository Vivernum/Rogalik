import { KAPLAYCtxT, Vec2 } from "kaplay";


export function createParticles(k: KAPLAYCtxT, pos: Vec2, dir: Vec2, count: number = 10, color = k.YELLOW) {
    for (let i = 0; i < count; i++) {
      k.add([
        k.pos(pos),
        k.rect(5, 5),
        k.color(color),
        k.opacity(k.rand(0.5, 1)),
        k.lifespan(k.rand(0.3, 0.5)),
        k.move(k.rand(k.vec2(-200, -200), k.vec2(200, 200)).angle(), k.rand(k.vec2(-200, -200), k.vec2(200, 200)).angle()),
      ]);
    }
  }