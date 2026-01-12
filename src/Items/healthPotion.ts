import { KAPLAYCtxT, GameObj, PosComp, SpriteComp, AreaComp, OpacityComp, ZComp } from "kaplay";
import { IInventory } from "../GameInstances/CInvetntory";

export interface IHealthPotionComp {
  isPickable: boolean,
  isEquipped: boolean,
};

export type THealthPotion = GameObj<PosComp | SpriteComp | AreaComp | OpacityComp | IHealthPotionComp>;

export class HealthPotion {
  protected healthPotion: THealthPotion;
  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected inventory: IInventory,
  ) {
    k.loadSprite('healthPotion', 'sprites/Items/health.png', {
      sliceX: 3,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 2,
          loop: true,
          pingpong: true,
        },
        static: {
          from: 0,
          to: 0,
        },
      },
    });

    this.healthPotion = k.add([
      k.sprite('healthPotion', { anim: 'idle' }),
      k.pos(pos[0], pos[1]),
      k.anchor('center'),
      k.opacity(1),
      k.area(),
      'item',
      {
        isPickable: false,
        isEquipped: false,
      }
    ]);

    this.healthPotion.onCollide('player', () => {
      this.healthPotion.isPickable = true;
    });

    this.healthPotion.onCollideEnd('player', () => {
      this.healthPotion.isPickable = false;
    });

    this.healthPotion.onKeyPress('f', () => {
      if (this.healthPotion.isPickable && !this.healthPotion.isEquipped) {
        this.inventory.equip(this.healthPotion);
        this.healthPotion.destroy();
      };
    });

  };

  // getInstance(): THealthPotion {
  //   return this.healthPotion;
  // }
};