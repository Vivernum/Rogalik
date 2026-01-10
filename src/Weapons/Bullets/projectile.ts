import { KAPLAYCtxT, GameObj, Vec2, Texture, Quad, SpriteData, Asset } from "kaplay";
import { TAk } from "../CAk";

type TParticlesData = {
  texture: Texture;
  quad: Quad[];
};

let cachedParticlesData: TParticlesData | null = null;
let cachedProjectile: Asset<SpriteData> | null = null;

export function createProjectile
(
  k: KAPLAYCtxT,
  gun: TAk,
  dir: Vec2,
  rotation: number,
  damage: number
) {
  if (!cachedProjectile) {
    let projectileData = k.loadSprite('projectile', 'sprites/Weapons/projectile.png');
  
    projectileData.onLoad(() => {
      cachedProjectile = projectileData;
    });
  };

  let particlesData: Asset<SpriteData>;

  // caching so there is no need to load the sprite every time
  // and we don't get errors
  if (!cachedParticlesData) {
    particlesData = k.loadSprite('particle', 'sprites/Weapons/projectileParticles.png');
    particlesData.onLoad(() => {
      const hexagonSprite = k.getSprite('particle');
      
      cachedParticlesData = {
        texture: hexagonSprite.data.tex,
        quad: [hexagonSprite.data.frames[0]]
      };
    });
  };

  const projectile = k.add([
    k.sprite(cachedProjectile ? cachedProjectile : k.getSprite('projectile')),
    k.pos(gun.pos),
    k.area(),
    k.move(dir, 400),
    k.offscreen({ destroy: true}),
    k.rotate(rotation),
    k.anchor(k.vec2(-10, 0)),
    {
      damage: damage,
      lastPos: null,
    },
    'projectile',
  ]);

  projectile.onCollide((obj: GameObj) => {
    if
    (
      obj.tags.includes('enemy') ||
      obj.tags.includes('wall') || 
      obj.tags.includes('obstacle')
    ) {
      obj.hp -= damage;
      // @FIXME: probably this cause particles appear in 0:0 if
      // collision appears to be out of the screen
      const collisionCenter = k.vec2(
        (projectile.pos.x + obj.pos.x) / 2,
        (projectile.pos.y + obj.pos.y) / 2
      );
      projectile.lastPos = collisionCenter;
      projectile.destroy();
    };
  });

  projectile.onDestroy(() => {
    if (cachedParticlesData) {
      const splatter = k.add([
        k.particles({
          max: 15,
          speed: [100, 150],
          lifeTime: [0.3, 0.5],
          colors: [k.WHITE],
          opacities: [1.0, 0.8],
          angle: [0, 180],
          texture: cachedParticlesData.texture,
          quads: cachedParticlesData.quad,
        }, {
          position: projectile.lastPos,
          lifetime: 0.5,
          rate: 0,
          direction: dir.scale(-1).angle(),
          spread: 40,
        }),
      ]);
      splatter.emit(10);
      splatter.onEnd(() => {
        k.destroy(splatter);
      });
    } else return;
  });

  return projectile;
};