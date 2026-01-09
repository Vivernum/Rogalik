import { KAPLAYCtxT, GameObj, PosComp, HealthComp, AreaComp } from "kaplay";
import { createHelthBar } from "../utils/healthBar";
import { createParticles } from "../utils/collisionParticles";
import { IInventory } from "../GameInstances/CInvetntory";

export interface IPlayer {
  damageHandler: (damage: number) => void,
};

export interface PlayerComp {
  hitCooldown: number,
  lastHitTime: number,
  isItemPickable: boolean,
};

export type TPlayer = GameObj<PosComp | HealthComp | PlayerComp | AreaComp>;

export class Player implements IPlayer{
  protected player: TPlayer;

  constructor(
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected inventory: IInventory,
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
      k.stay(),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 20),
      }),
      k.body(),
      'player',
      {
        hitCooldown: 1,
        lastHitTime: 0,
        isItemPickable: false,

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

    // this.player.onCollide('item', (item: GameObj) => {
    //   this.player.isItemPickable = true;
    //   this.player.onKeyPress('f', () => {
    //     if (this.player.isItemPickable) {
    //       this.inventory.equip(item);
    //     };
    //     })

    //   this.player.onKeyPress('q', () => {
    //     if (!item.isEquipped) return;
    //     this.inventory.unEquip(item);
    //   })
    // });

    // this.player.onCollideEnd('item', () => {
    //   this.player.isItemPickable = false;
    // });

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

  setPosition(x: number, y: number): void {
    this.player.pos.x = x;
    this.player.pos.y = y;
  };
};