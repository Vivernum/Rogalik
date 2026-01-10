import kaplay, { KAPLAYCtxT } from "kaplay";

import { map } from './Levels/testLevel';
import { createGameLevel } from "./Levels/createGameLevel";
import { Player} from "./Entities/CPlayer";
import { Shriker } from "./Entities/CShriker";
import { Inventory } from "./GameInstances/CInvetntory";
import { Ak } from "./Weapons/CAk";

const k = kaplay({
  background: 'white',
});

k.debug.inspect = false;

// k.loadRoot("./"); // A good idea for Itch.io publishing later

// const level = createGameLevel(k, map);

// const playerModel = new Player(k, [100, 100]);

// new Dio(k, [400,400], playerModel);
// new Dio(k, [600,600], playerModel);
// new Dio(k, [800,200], playerModel);
// new Dio(k, [1000,400], playerModel);
// new Dio(k, [700,200], playerModel);

const inventory = new Inventory(k);
const player = new Player(k, [100, 100], inventory);
k.scene('secando', () => {
const level = createGameLevel(k, map);

new Shriker(k, [400, 450], player);
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
  });

  const ak = new Ak(k, [300, 200], player);
  const ak1 = new Ak(k, [300, 300], player);
  new Shriker(k, [400, 650], player);

  k.onSceneLeave(() => {
    player.setPosition(500,500);
  })
});
k.go('begining');