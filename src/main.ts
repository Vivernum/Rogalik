import kaplay, { GameObj, Polygon, Rect } from "kaplay";
import { createPlayer } from "./Entities/Player";
import { createAk } from "./Weapons/ak";

import { map } from './Levels/testLevel';
import { createEnemy } from "./Entities/Enemy";
import { createGameLevel } from "./Levels/createGameLevel";

const k = kaplay({
  background: '#000000'
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

const level = createGameLevel(k, map);

const player: GameObj = createPlayer(k);
const ak = createAk(k);

const info = k.add([
  k.fixed(),
  k.pos(20, 20),
  k.rect(150, 100, {
    radius: 5,
  }),
  k.outline(4, k.YELLOW),
  k.color(k.WHITE),
]);

const text = info.add([
  k.pos(30, 30),
  k.fixed(),
  k.text(`X - ${player.pos.x}\nY - ${player.pos.y}`, {
    size: 20,
  }),
  k.color(k.BLACK),
]);

text.onUpdate(() => {
  text.text = `X - ${Math.floor(player.pos.x)}\nY - ${Math.floor(player.pos.y)}`;
})

createEnemy(k, level, [400,400]);
createEnemy(k, level, [600,600]);
createEnemy(k, level, [800,200]);
createEnemy(k, level, [1000,400]);
createEnemy(k, level, [700,200]);