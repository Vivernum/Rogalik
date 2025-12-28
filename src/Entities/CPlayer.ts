import kaplay, { KAPLAYCtxT, GameObj } from "kaplay";

const UP = [0, -1];
const DOWN = [0, 1];
const LEFT = [-1, 0];
const RIGHT = [1, 0];

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

export class Player {
  protected player: GameObj;
  protected gun: GameObj;

  constructor(
    protected k: KAPLAYCtxT,
    protected pos: number[],
  ) {
    this.k = k;
    k.loadSprite("jotaro", "sprites/jotaro-outline.png");

    this.player = k.add([
      k.sprite("jotaro"),
      k.pos(pos[0], pos[1]),
      k.anchor(k.vec2(0, 0)),
      k.area(),
      k.body(),
      'player',
    ]);

    for (const key in dirs) {
      this.player.onKeyDown(key, () => {
        const [x, y] = dirs[key];
        this.player.move(x * SPEED, y * SPEED);
      });
    };
  };

  getInstance() {
    return this.player;
  };
}