import { KAPLAYCtxT } from "kaplay";
import { createParticles } from "../utils/collisionParticles";

const tileDimension = 32;

export function createGameLevel(k: KAPLAYCtxT, map: string[]) {

  k.loadSprite('floor', 'sprites/Textures/floor.png');
  k.loadSprite('lava', 'sprites/Textures/lava.png');
  k.loadSprite('wallW', 'sprites/Textures/wallOnWidth.png');
  k.loadSprite('wallH', 'sprites/Textures/wallOnHeight.png');
  k.loadSprite('obstacle', 'sprites/Textures/obstacle.png');


  const level = k.addLevel(map, {
    tileWidth: tileDimension,
    tileHeight: tileDimension,
    tiles: {
      "w": () => [
        k.sprite("wallW"),
        k.area(),
        k.anchor(k.vec2(0, 0)),
        k.body({ isStatic: true }),
        "wall"
      ],
      "h": () => [
        k.sprite("wallH"),
        k.area(),
        k.anchor(k.vec2(0, 0)),
        k.body({ isStatic: true}),
        "wall",
      ],
      "l": () => [
        k.sprite("lava"),
        k.area(),
        "lava",
        'dangerousFloor',
      ],
    },
  });

  createObstacles(k, map);
  k.add([
    k.sprite('floor', {
      width: map[0].length * tileDimension,
      height: map.length * tileDimension,
      tiled: true,
    }),
    k.pos(-(tileDimension / 2), -(tileDimension / 2)),
    k.z(-100),
  ]);

  return level;
};

function createObstacles(k: KAPLAYCtxT, map: string[]) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];

      if (tile === 'o') {
        const levelX = x * tileDimension;
        const levelY = y * tileDimension;

        const obstacle = k.add([
          k.sprite('obstacle'),
          k.opacity(1),
          k.health(50),
          k.anchor(k.vec2(0, 0)),
          k.pos(levelX, levelY),
          k.area(),
          k.body({ isStatic: true }),
          'obstacle',
        ]);

        obstacle.onHurt((damage: number) => {
          obstacle.opacity -= damage * 0.01;
        });

        obstacle.onDeath(() => {
          createParticles(k, obstacle.pos, 20, k.BLACK);
          obstacle.destroy();
        });
      };
    };
  };
};