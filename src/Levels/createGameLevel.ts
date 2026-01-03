import { KAPLAYCtxT } from "kaplay";

export function createGameLevel(k: KAPLAYCtxT, map: string[]) {

  k.loadSprite('floor', 'sprites/Textures/floor.png');
  k.loadSprite('lava', 'sprites/Textures/lava.png');
  k.loadSprite('wallW', 'sprites/Textures/wallOnWidth.png');
  k.loadSprite('wallH', 'sprites/Textures/wallOnHeight.png');

  const level = k.addLevel(map, {
    tileWidth: 50,
    tileHeight: 50,
    tiles: {
      "w": () => [
        k.sprite("wallW"),
        k.area(),
        k.body({ isStatic: true }),
        "wall"
      ],
      "h": () => [
        k.sprite("wallH"),
        k.area(),
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

  return level;
};

function createObstacles(k: KAPLAYCtxT, map: string[]) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = map[y][x];

      if (tile === 'o') {
        const levelX = x * 50;
        const levelY = y * 50;

        const obstacle = k.add([
          k.sprite('wallH'),
          k.opacity(1),
          k.health(50),
          k.pos(levelX, levelY),
          k.area(),
          k.body({ isStatic: true }),
          'obstacle',
        ]);

        obstacle.onHurt((damage: number) => {
          obstacle.opacity -= damage * 0.01;
        });

        obstacle.onDeath(() => {
          obstacle.destroy();
        });
      };
    };
  };
};