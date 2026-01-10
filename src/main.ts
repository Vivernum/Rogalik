import kaplay, { KAPLAYCtxT } from "kaplay";

import { map, map2 } from './Levels/testLevel';
import { createGameLevel } from "./Levels/createGameLevel";
import { Player} from "./Entities/CPlayer";
import { Shriker } from "./Entities/CShriker";
import { Inventory } from "./GameInstances/CInvetntory";
import { Ak } from "./Weapons/CAk";

const k = kaplay({
  background: 'black',
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
  k.loadSprite('obstacle', 'sprites/Textures/obstacle.png');
  let score: number | null = null;
  k.onUpdate(() => {
    score = k.get('enemy').length;
    if (score === 0) k.go('secando');
  });

  const level = createGameLevel(k, map2);

  const ak = new Ak(k, [300, 200], player);
  const ak1 = new Ak(k, [300, 300], player);
  for (let i = 0; i < 4; i++) {
    new Shriker(k, [i * 200, 550], player);
  };

  k.onSceneLeave(() => {
    player.setPosition(500,500);
  })
});
k.go('begining');