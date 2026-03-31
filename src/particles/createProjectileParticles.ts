import { KAPLAYCtxT, Vec2 } from "kaplay";
import { TParticlesData } from "../types/particles";

export function createProjectileParticles(
  k: KAPLAYCtxT,
  position: Vec2,
  direction: Vec2,
  texture: TParticlesData,
) {
  const splatter = k.add([
    k.opacity(1),
    k.particles(
      {
        max: 20,
        speed: [100, 120],
        lifeTime: [0.3, 0.5],
        colors: [k.WHITE],
        opacities: [1.0, 0.8],
        angle: [0, 180],
        texture: texture.texture,
        quads: texture.quad,
      },
      {
        position: position,
        lifetime: 0.4,
        rate: 0,
        direction: direction.scale(-1).angle(),
        spread: 45,
      },
    ),
  ]);
  splatter.emit(20);
  splatter.onEnd(() => {
    k.destroy(splatter);
  });
}
