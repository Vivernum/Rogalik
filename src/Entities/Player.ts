import { KAPLAYCtxT } from "kaplay";

export function createPlayer(k: KAPLAYCtxT) {

  const dirs = {
    'w': k.UP,
    'd': k.RIGHT,
    's': k.DOWN,
    'a': k.LEFT,
    'left': k.LEFT,
    'right': k.RIGHT,
    'up': k.UP,
    'down': k.DOWN,
  };

  const SPEED: number = 250;

  k.loadSprite("jotaro", "sprites/Entities/jotaro-outline.png");

  const player = k.add([
    k.sprite("jotaro"),
      k.pos(100, 100),
      k.health(100),
      k.anchor(k.vec2(0, 0)),
      k.opacity(1),
      k.area(),
      k.body(),
      'player',
  ]);

  for (const key in dirs) {
    player.onKeyDown(key, () => {
      player.move(dirs[key].scale(SPEED));
    });
  };

  let dangerousFloorCollisionCount: number = 0;
  let damageTimer: number = 0;

  player.onUpdate(() => {
    k.setCamPos(player.pos);
    k.setCamScale(1.8);
    k.setCamRot(0);

    // damage on some types of floors
    // though im going to relocate this part of functionality
    // to the tile itself cause, obviously, player obj shouldn't be responsible for it
    if(dangerousFloorCollisionCount > 0) {
      damageTimer += k.dt();
      if(damageTimer >= 1) {
        damageTimer = 0;
        player.hp -= 20;
      };
    } else {
      damageTimer = 0;
    };
  });

  player.onCollide('dangerousFloor', () => {
    if (dangerousFloorCollisionCount === 0) {
    player.hp -= 20
    };
    dangerousFloorCollisionCount++;
  });

  player.onCollideEnd('dangerousFloor', () => {
    dangerousFloorCollisionCount--;
  })

  player.onHurt(() => {
    player.opacity -= 0.2;
  });

  player.onDeath(() => {
    player.destroy();
  });

  return player;
};