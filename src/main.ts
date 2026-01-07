import kaplay, { GameObj, Polygon, Rect } from "kaplay";
import { createPlayer } from "./Entities/Player";
import { createAk } from "./Weapons/ak";

import { map } from './Levels/testLevel';
import { createEnemy } from "./Entities/Enemy";
import { createGameLevel } from "./Levels/createGameLevel";
import { Player, IPlayer} from "./Entities/CPlayer";
import { Dio } from "./Entities/CDio";
import { Inventory } from "./GameInstances/CInvetntory";

const k = kaplay({
  background: 'white',
});

k.debug.inspect = false;

// k.onKeyPress('p', () => {
//   k.debug.inspect = !k.debug.inspect;
// });


// k.loadRoot("./"); // A good idea for Itch.io publishing later

// const level = createGameLevel(k, map);

// const player: GameObj = createPlayer(k);
// const playerModel = new Player(k, [100, 100]);
// const ak = createAk(k);

// new Dio(k, [400,400], playerModel);
// new Dio(k, [600,600], playerModel);
// new Dio(k, [800,200], playerModel);
// new Dio(k, [1000,400], playerModel);
// new Dio(k, [700,200], playerModel);

// createEnemy(k, [400,400]);
// createEnemy(k, [600,600]);
// createEnemy(k, [800,200]);
// createEnemy(k, [1000,400]);
// createEnemy(k, [700,200]);

const inventory = new Inventory(k);
const player = new Player(k, [100, 100], inventory);
k.scene('secando', () => {
const level = createGameLevel(k, map);

new Dio(k, [400, 600], player);
});

k.scene('begining', () => {
  k.loadSprite('floor', 'sprites/Textures/floor.png');

  k.add([
    k.pos(0, 0),
    k.rect(1000, 20),
    k.area(),
    k.body({isStatic: true}),
    k.color(k.rgb(128, 64, 48)),
    'wall',
  ]);
  k.add([
    k.pos(0, 780),
    k.rect(1000, 20),
    k.area(),
    k.body({isStatic: true}),
    k.color(k.rgb(128, 64, 48)),
    'wall',
  ]);k.add([
    k.pos(0, 0),
    k.rect(20, 800),
    k.area(),
    k.body({isStatic: true}),
    k.color(k.rgb(128, 64, 48)),
    'wall',
  ]);k.add([
    k.pos(980, 0),
    k.rect(20, 800),
    k.area(),
    k.body({isStatic: true}),
    k.color(k.rgb(128, 64, 48)),
    'wall',
  ]);

  const obstacle = k.add([
    k.sprite('floor'),
          k.opacity(1),
          k.health(50),
          k.anchor(k.vec2(0, 0)),
          k.pos(200, 200),
          k.area(),
          k.body({ isStatic: true }),
          'obstacle',
  ]);

  obstacle.onDeath(() => {
    k.go('secando');
  })
  
  const ak = createAk(k);
  const enemy = new Dio(k, [400, 600], player);

  k.onSceneLeave(() => {
    player.setPosition(500,500);
  })
});
k.go('begining');