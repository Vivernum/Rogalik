import kaplay from "kaplay";

import { map, map2 } from './Levels/testLevel';
import { createGameLevel } from "./Levels/createGameLevel";
import { Player} from "./Entities/CPlayer";
import { Shriker } from "./Entities/CShriker";
import { Inventory } from "./GameInstances/CInvetntory";
import { WeaponProvider } from "./Weapons/WeaponProvider";
import { HealthPotion } from "./Items/healthPotion";

const k = kaplay({
  background: 'black',
});

k.debug.inspect = false;
// k.loadRoot("./"); // A good idea for Itch.io publishing later

const inventory = new Inventory(k);
const player = new Player(k, [100, 100], inventory);
const weaponProvider = new WeaponProvider(k);


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
  
  const bazooka = weaponProvider.getBazooka([300, 300], player);
  const kolt = weaponProvider.getKolt([300, 200], player);
  const ak = weaponProvider.getAk([200, 150], player);
  const health = new HealthPotion(k, [300, 100], inventory);

  // const some = health.getInstance();

  // const health1 = new HealthPotion(k, [122, 100], inventory);
  // const health2 = new HealthPotion(k, [200, 100], inventory);
  // const health3 = new HealthPotion(k, [50, 100], inventory);
  // const health4 = new HealthPotion(k, [300, 50], inventory);
  // const health5 = new HealthPotion(k, [400, 100], inventory);
  // const health6 = new HealthPotion(k, [500, 100], inventory);
  // const health7 = new HealthPotion(k, [600, 100], inventory);
  // const health8= new HealthPotion(k, [400, 50], inventory);
  // const health9= new HealthPotion(k, [500, 50], inventory);

  for (let i = 1; i <= 1; i++) {
    new Shriker(k, [i * 200, 550], player);
  };

  k.onSceneLeave(() => {
    player.setPosition(500,500);
  })
});
k.go('begining');