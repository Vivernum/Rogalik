import kaplay, { GameObj } from "kaplay";
import { createPlayer } from "./Entities/Player";
import { createAk } from "./Weapons/ak";

import { map } from './Levels/testLevel';

const k = kaplay({
  // width: 1000,
  // height: 800,
  // letterbox: true,
  background: '#000000'
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.loadSprite('floor', 'sprites/Textures/floor.png');
k.loadSprite('lava', 'sprites/Textures/lava.png');
k.loadSprite('wallW', 'sprites/Textures/wallOnWidth.png');
k.loadSprite('wallH', 'sprites/Textures/wallOnHeight.png');

k.addLevel(map, {
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
})

const player: GameObj = createPlayer(k);
const ak = createAk(k, player);