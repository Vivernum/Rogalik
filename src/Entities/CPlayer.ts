import { KAPLAYCtxT, GameObj, PosComp, HealthComp, AreaComp } from "kaplay";
import { createHelthBar } from "../utils/healthBar";
import { createParticles } from "../utils/collisionParticles";
import { IInventory } from "../GameInstances/CInvetntory";
import { TWeapon } from "../Weapons/CWeapon";

export interface IPlayerEnemyActions {
  damageHandler: (damage: number) => void,
};

export interface IPlayerWeaponActions {
  player: TPlayer,
  equipWeapon: (weapon: TWeapon) => void,
  unEquipWeapon: () => void,
};

export interface PlayerComp {
  hitCooldown: number,
  lastHitTime: number,
  pickedWeapon: null | TWeapon,
  speed: number,
};

export type TPlayer = GameObj<PosComp | HealthComp | PlayerComp | AreaComp>;

export class Player implements IPlayerEnemyActions, IPlayerWeaponActions {
  player: TPlayer;

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
    };

    k.loadSprite("jotaro", "sprites/Entities/jotaro.png", {
      sliceX: 4,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 3,
          loop: true,
          pingpong: true,
        }
      }
    });

    this.player = k.add([
      k.sprite("jotaro", {
        anim: 'idle',
      }),
      k.pos(this.pos[0], this.pos[1]),
      k.health(100, 100),
      k.anchor('center'),
      k.opacity(1),
      k.stay(),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 16),
      }),
      k.body(),
      'player',
      {
        hitCooldown: 1,
        lastHitTime: 0,
        pickedWeapon: null,
        speed: 200,

        update() {
          k.setCamPos(this.pos);
          k.setCamScale(2.3);
          k.setCamRot(0);

          this.lastHitTime += k.dt();
        }
      }
    ]);

    for (const key in dirs) {
      this.player.onKeyDown(key, () => {;
        this.player.move(dirs[key].scale(this.player.speed));
      });
    };

    const healthBarFill = createHelthBar(k, this.player, k.vec2(0, -25));

    this.player.onHurt(() => {
      healthBarFill.width = (this.player.hp / this.player.maxHP) * 40;
    });

    this.player.onDeath(() => {
      if (this.player.pickedWeapon) this.unEquipWeapon();
      createParticles(k, this.player.pos, 20, k.RED);
      this.player.destroy();
    });

    // Inventory
    this.player.onKeyPress('i', () => {
      if (!this.inventory.isInventoryOpen) {
        this.inventory.renderIventory();
      } else {
        this.inventory.closeInventory();
      }
    });

    this.player.onKeyPress('e', () => {
      if (this.inventory.isInventoryOpen) {
        this.inventory.unEquip(this.player.pos);
      };
    })
  };

  // Method to handle player damage
  damageHandler(damage: number): void {
    if (this.player.lastHitTime > this.player.hitCooldown) {
      this.player.hp -= damage;
      this.player.lastHitTime = 0;
    } else {
      return;
    };
  };

// Methods to equip and unequip weapons
  equipWeapon(weapon: TWeapon): void {
    if (!this.player.pickedWeapon) {
      this.player.pickedWeapon = weapon;
      this.player.pickedWeapon.use(this.k.follow(this.player));
      this.player.pickedWeapon.anchor = this.k.vec2(-1, 0);
      this.player.pickedWeapon.isEquipped = true;
    }
  };

  unEquipWeapon(): void {
    if (this.player.pickedWeapon) {
      this.player.pickedWeapon.unuse('follow');
      this.player.pickedWeapon.anchor = 'center';
      Math.abs(this.player.pickedWeapon.angle) > 90 ? this.player.pickedWeapon.angle = 180 : this.player.pickedWeapon.angle = 0;
      this.player.pickedWeapon.isEquipped = false;
      this.player.pickedWeapon = null;
    }
  };

  // Method to set player position
  setPosition(x: number, y: number): void {
    this.player.pos.x = x;
    this.player.pos.y = y;
  };
};