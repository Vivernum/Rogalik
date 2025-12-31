import kaplay, { GameObj } from "kaplay";
import { createPlayer } from "./Entities/Player";
import { createAk } from "./Weapons/ak";

import { map } from './Levels/testLevel';
import { createEnemy } from "./Entities/Enemy";

const k = kaplay({
  background: '#000000'
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

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
    " ": () => [
      k.sprite("floor"),
      "floor"
    ]
  }
});

const player: GameObj = createPlayer(k);
const ak = createAk(k, player);

createEnemy(k, level, [400,400]);
createEnemy(k, level, [600,600]);
createEnemy(k, level, [800,200]);
createEnemy(k, level, [1000,400]);
createEnemy(k, level, [700,200]);
k.onUpdate('enemy', (enemy: GameObj) => {
  if(enemy.action === 'pursuit') {
    enemy.moveTo(player.pos, 200);
  };
});