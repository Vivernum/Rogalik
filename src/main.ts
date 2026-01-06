import kaplay, { GameObj, Polygon, Rect } from "kaplay";
import { createPlayer } from "./Entities/Player";
import { createAk } from "./Weapons/ak";

import { map } from './Levels/testLevel';
import { createEnemy } from "./Entities/Enemy";
import { createGameLevel } from "./Levels/createGameLevel";
import { Player } from "./Entities/CPlayer";
import { Dio } from "./Entities/CDio";

const k = kaplay({
  background: 'white',
});

k.debug.inspect = false;

k.onKeyPress('p', () => {
  k.debug.inspect = !k.debug.inspect;
});


k.loadRoot("./"); // A good idea for Itch.io publishing later

const level = createGameLevel(k, map);

// const player: GameObj = createPlayer(k);
const playerModel = new Player(k, [100, 100]);
const ak = createAk(k);

new Dio(k, [400,400], playerModel);
new Dio(k, [600,600], playerModel);
new Dio(k, [800,200], playerModel);
new Dio(k, [1000,400], playerModel);
new Dio(k, [700,200], playerModel);

// createEnemy(k, [400,400]);
// createEnemy(k, [600,600]);
// createEnemy(k, [800,200]);
// createEnemy(k, [1000,400]);
// createEnemy(k, [700,200]);