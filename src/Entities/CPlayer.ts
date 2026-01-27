import { KAPLAYCtxT, GameObj, PosComp, HealthComp, AreaComp } from "kaplay";
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

export interface IHealthPlayerComp {
  player: TPlayer,
};

export interface PlayerComp {
  hitCooldown: number,
  timePassedSinceLastHit: number,
  equipedWeapon: null | TWeapon,
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
        timePassedSinceLastHit: 0,
        equipedWeapon: null,
        speed: 200,

        update() {
          k.setCamPos(this.pos);
          k.setCamScale(2.3);
          k.setCamRot(0);

          this.timePassedSinceLastHit += k.dt();
        }
      }
    ]);

    for (const key in dirs) {
      this.player.onKeyDown(key, () => {;
        this.player.move(dirs[key].scale(this.player.speed));
      });
    };

    this.player.onDeath(() => {
      if (this.player.equipedWeapon) this.unEquipWeapon();
      createParticles(k, this.player.pos, 20, k.RED);
      this.player.destroy();
    });

    // Inventory
    this.player.onKeyPress('i', () => {
      if (!this.inventory.isInventoryOpen) {
        this.inventory.openInventory();
      } else {
        this.inventory.closeInventory();
      }
    });

    this.player.onKeyPress('f', () => {
      if (this.inventory.isInventoryOpen) {
        this.inventory.unEquip(this.player.pos);
      };
    });

    this.player.onKeyPress('e', () => {
      if (this.inventory.isInventoryOpen) {
        this.inventory.useItem(this.player);
      };
    })
  };

  // Method to handle player damage
  damageHandler(damage: number): void {
    if (this.player.timePassedSinceLastHit > this.player.hitCooldown) {
      this.player.hp -= damage;
      this.player.timePassedSinceLastHit = 0;
    } else {
      return;
    };
  };

// Methods to equip and unequip weapons
  equipWeapon(weapon: TWeapon): void {
    if (!this.player.equipedWeapon) {
      this.player.equipedWeapon = weapon;
      this.player.equipedWeapon.use(this.k.follow(this.player));
      this.player.equipedWeapon.anchor = this.k.vec2(-1, 0);
      this.player.equipedWeapon.isEquipped = true;
    }
  };

  unEquipWeapon(): void {
    if (this.player.equipedWeapon) {
      this.player.equipedWeapon.unuse('follow');
      this.player.equipedWeapon.anchor = 'center';
      Math.abs(this.player.equipedWeapon.angle) > 90 ? this.player.equipedWeapon.angle = 180 : this.player.equipedWeapon.angle = 0;
      this.player.equipedWeapon.isEquipped = false;
      this.player.equipedWeapon = null;
    }
  };
};