import { KAPLAYCtxT } from "kaplay";

export function createPlayer(k: KAPLAYCtxT) {
  const UP = k.vec2(0, -1);
  const DOWN = k.vec2(0, 1);
  const LEFT = k.vec2(-1, 0);
  const RIGHT = k.vec2(1, 0);

  const dirs = {
    'w': UP,
    'd': RIGHT,
    's': DOWN,
    'a': LEFT,
    'left': LEFT,
    'right': RIGHT,
    'up': UP,
    'down': DOWN,
  };

  const SPEED = 300;

  k.loadSprite("jotaro", "sprites/jotaro-outline.png");

  const player = k.add([
    k.sprite("jotaro"),
      k.pos(50, 50),
      k.anchor(k.vec2(0, 0)),
      k.area(),
      k.body(),
      'player',
  ]);

  for (const key in dirs) {
      player.onKeyDown(key, () => {
        player.move(dirs[key].scale(SPEED));
      });
    };

  return player;
};