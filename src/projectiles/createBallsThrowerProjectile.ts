import {
  KAPLAYCtxT,
  GameObj,
  Vec2,
  SpriteData,
  Asset,
  PosComp,
  AreaComp,
  SpriteComp,
} from "kaplay";
import { TParticlesData } from "../types/particles";
import { createProjectileParticles } from "../particles/createProjectileParticles";
import { PartialAllAttackStatsType } from "../types/stats";
import { EffectsType, EnemyUseEffectCallbackType } from "../types/effect";

type ProjectileComp = {
  damage: PartialAllAttackStatsType;
  lastPosition: Vec2;
};
type TProjectile = GameObj<
  PosComp | AreaComp | PosComp | SpriteComp | ProjectileComp
>;

const PROJECTILE_RADIUS = 6;
const PROJECTILE_SPEED = 500;

let cachedParticlesData: TParticlesData | null = null;
let cachedProjectile: Asset<SpriteData> | null = null;

export function createBallsThrowerProjectile(
  k: KAPLAYCtxT,
  position: Vec2,
  direction: Vec2,
  angle: number,
  damage: PartialAllAttackStatsType,
  callback: EnemyUseEffectCallbackType,
  effectType: EffectsType,
) {
  if (!cachedProjectile) {
    let projectileData = k.loadSprite(
      "projectile",
      "sprites/Weapons/basicProjectile.png",
      {
        sliceX: 16,
        sliceY: 1,
        anims: {
          idle: {
            from: 0,
            to: 7,
            loop: true,
            speed: 40,
          },
          splash: {
            from: 8,
            to: 15,
            speed: 30,
          },
        },
      },
    );

    projectileData.onLoad(() => {
      cachedProjectile = projectileData;
    });
  }

  let particlesData: Asset<SpriteData>;

  // caching so there is no need to load the sprite every time
  // and we don't get errors
  if (!cachedParticlesData) {
    particlesData = k.loadSprite(
      "particle",
      "sprites/Particles/ballsThrowerParticle.png",
    );
    particlesData.onLoad(() => {
      const hexagonSprite = k.getSprite("particle");

      cachedParticlesData = {
        texture: hexagonSprite!.data!.tex,
        quad: [hexagonSprite!.data!.frames[0]],
      };
    });
  }

  const projectile: TProjectile = k.add([
    k.sprite(
      cachedProjectile !== null ? cachedProjectile : k.getSprite("projectile"),
      {
        anim: "idle",
      },
    ),
    k.pos(position),
    k.rotate(angle),
    k.area({
      shape: new k.Circle(k.vec2(0, 0), PROJECTILE_RADIUS),
    }),
    k.move(direction, PROJECTILE_SPEED),
    k.offscreen({ destroy: true }),
    k.anchor(k.vec2(0, 0)),
    {
      damage,
      lastPosition: k.vec2(0, 0),
    },
    "projectile",
  ]);

  projectile.onCollide((obj: GameObj) => {
    if (obj.tags.includes("enemy")) {
      obj.takeDamage(projectile.damage, callback, effectType);
      // @FIXME: probably this cause particles appear in 0:0 if
      // collision appears to be out of the screen
      const collisionCenter = k.vec2(
        (projectile.pos.x + obj.pos.x) / 2,
        (projectile.pos.y + obj.pos.y) / 2,
      );
      projectile.lastPosition = collisionCenter;
      projectile.destroy();
    }
    if (obj.tags.includes("wall") || obj.tags.includes("obstacle")) {
      const collisionCenter = k.vec2(
        (projectile.pos.x + obj.pos.x) / 2,
        (projectile.pos.y + obj.pos.y) / 2,
      );
      projectile.lastPosition = collisionCenter;
      projectile.destroy();
    }
  });

  projectile.onDestroy(() => {
    if (cachedParticlesData) {
      createProjectileParticles(
        k,
        projectile.lastPosition,
        direction,
        cachedParticlesData,
      );
    } else return;
  });

  return projectile;
}
