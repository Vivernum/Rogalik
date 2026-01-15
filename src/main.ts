import kaplay, { HashGrid, NavMesh } from "kaplay";

import { map, map2 } from './Levels/testLevel';
import { createGameLevel } from "./Levels/createGameLevel";
import { Player} from "./Entities/CPlayer";
import { Shriker } from "./Entities/CShriker";
import { Inventory } from "./GameInstances/CInvetntory";
import { WeaponProvider } from "./Weapons/WeaponProvider";
import { ItemProvider } from "./Items/ItemProvider";
import { PlayersHealthBar } from "./GameInstances/PlayersHealthBar";

const k = kaplay({
  background: 'black',
});

k.debug.inspect = false;
// k.loadRoot("./"); // A good idea for Itch.io publishing later

const itemsProvider = new ItemProvider(k);
const inventory = new Inventory(k, itemsProvider);
const player = new Player(k, [100, 100], inventory);
const weaponProvider = new WeaponProvider(k);
const healthBar = new PlayersHealthBar(k, player);


k.scene('secando', () => {
  const level = createGameLevel(k, map);
  const health = itemsProvider.getHealthPotion([400, 100], inventory);
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
  
  const bazooka = weaponProvider.getBazooka([300, 300], player);
  const kolt = weaponProvider.getKolt([300, 200], player);
  const ak = weaponProvider.getAk([200, 150], player);

  const health = itemsProvider.getHealthPotion([400, 100], inventory);
  const speed = itemsProvider.getFireSpeedPotion([500, 120], inventory);
  const health1 = itemsProvider.getHealthPotion([122, 100], inventory);
  const health3 = itemsProvider.getFireSpeedPotion([50, 100], inventory);
  const health4 = itemsProvider.getHealthPotion([300, 50], inventory);

  // for (let i = 1; i <= 3; i++) {
    new Shriker(k, [200, 550], player);
  // };

  k.onSceneLeave(() => {
    player.setPosition(500,500);
  })
});
k.go('begining');