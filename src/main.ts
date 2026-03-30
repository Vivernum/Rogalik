import kaplay from "kaplay";

import { map } from './Levels/testLevel';
import { createGameLevel } from "./Levels/createGameLevel";
import { Player} from "./Entities/CPlayer";
import { Shriker } from "./Entities/CShriker";
import { PlayersHealthBar } from "./GameInstances/PlayersHealthBar";

const k = kaplay({
  background: 'black',
});

k.debug.inspect = false;
// k.loadRoot("./"); // A good idea for Itch.io publishing later
const player = new Player(k, [500, 500]);
const healthBar = new PlayersHealthBar(k, player);

k.scene('begining', () => {

  const level = createGameLevel(k, map);

  // for (let i = 1; i <= 3; i++) {
  //   new Shriker(k, [i * 200, 550], player);
  // };
});

k.go('begining');