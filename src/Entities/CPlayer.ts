import { KAPLAYCtxT, GameObj, PosComp, HealthComp } from "kaplay";
import { createHelthBar } from "../utils/healthBar";
import { createParticles } from "../utils/collisionParticles";

export interface IPlayer {
  player: GameObj,
  k: KAPLAYCtxT,
  pos: number[],
  damageHandler: (damage: number) => void,
}

export class Player implements IPlayer{
   player: GameObj;

  constructor(
     public k: KAPLAYCtxT,
     public pos: number[],
  ) {
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

    this.player = k.add([
      k.sprite("jotaro"),
      k.pos(this.pos[0], this.pos[1]),
      k.health(100, 100),
      k.anchor('center'),
      k.opacity(1),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 20),
      }),
      k.body(),
      'player',
      {
        hitCooldown: 1,
        lastHitTime: 0,

        update() {
          k.setCamPos(this.pos);
          k.setCamScale(1.8);
          k.setCamRot(0);

          this.lastHitTime += k.dt();
        }
      }
    ]);

    for (const key in dirs) {
      this.player.onKeyDown(key, () => {
        this.player.move(dirs[key].scale(SPEED));
      });
    };

    const healthBarFill = createHelthBar(k, this.player, k.vec2(0, -35));

    this.player.onHurt((damage: number) => {
      healthBarFill.width = (this.player.hp / this.player.maxHP) * 60;
    });

    this.player.onDeath(() => {
      createParticles(k, this.player.pos, 20, k.RED);
      this.player.destroy();
    });
  };

  damageHandler(damage: number): void {
    if (this.player.lastHitTime > this.player.hitCooldown) {
      this.player.hp -= damage;
      this.player.lastHitTime = 0;
    } else {
      return;
    };
  };

}