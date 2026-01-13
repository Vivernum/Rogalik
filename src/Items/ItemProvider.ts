import { KAPLAYCtxT, Vec2 } from "kaplay";
import { HealthPotion } from "./healthPotion";
import { FireSpeedPotion } from "./fireSpeedPotion";
import { IInventory } from "../GameInstances/CInvetntory";
import { TItem } from "./CItem";
import { TItemNames } from "./CItem";

export interface IItemProvider {
  defineItem: (name: TItemNames, pos: Vec2, inventory: IInventory) => TItem,
};

export class ItemProvider {
  constructor (
    protected k: KAPLAYCtxT,
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

    k.loadSprite('fireSpeedPotion', 'sprites/Items/fireSpeed.png', {
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
  };

  getHealthPotion(pos: number[], inventory: IInventory) {
    const healtPotion = new HealthPotion(this.k, pos, inventory, 'healthPotion');
    return healtPotion.getItem();
  };

  getFireSpeedPotion(pos: number[], inventory: IInventory) {
    const fireSpeedPotion = new FireSpeedPotion(this.k, pos, inventory, 'fireSpeedPotion');
    return fireSpeedPotion.getItem();
  };

  defineItem(name: TItemNames, pos: Vec2, inventory: IInventory): TItem {
    switch (name) {
      case 'healthPotion': {
        return this.getHealthPotion([pos.x, pos.y], inventory);
      };
      case 'fireSpeedPotion': {
        return this.getFireSpeedPotion([pos.x, pos.y], inventory);
      };
    };
  };
};