import { TPlayer } from "../Entities/CPlayer";
import { IInventory } from "../GameInstances/CInvetntory";
import { GameObj, PosComp, SpriteComp, AreaComp, OpacityComp, KAPLAYCtxT } from "kaplay";

export interface IItem {
  isPickable: boolean,
  isEquipped: boolean,
  callback: (player: TPlayer, k: KAPLAYCtxT) => void,
};

export type TItem = GameObj<PosComp | SpriteComp | AreaComp | OpacityComp | IItem>


export type TItemNames = 'healthPotion' | 'fireSpeedPotion';

export abstract class Item {
  protected item: TItem;

  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected inventory: IInventory,
    protected itemSprite: TItemNames,
  ) {
    this.item = k.add([
      k.sprite(itemSprite, { anim: 'idle' }),
      k.pos(pos[0], pos[1]),
      k.anchor('center'),
      k.opacity(1),
      k.area(),
      'item',
      {
        isPickable: false,
        isEquipped: false,
        callback: this.callback,
      }
    ]);

    this.item.onCollide('player', () => {
      this.item.isPickable = true;
    });

    this.item.onCollideEnd('player', () => {
      this.item.isPickable = false;
    });

    this.item.onKeyPress('f', () => {
      if (this.item.isPickable && !this.item.isEquipped && !this.inventory.isINventoryFull) {
        this.inventory.equip(this.item);
        this.item.destroy();
      };
    });
  };

  callback(player: TPlayer, k: KAPLAYCtxT): void {};

  getItem(): TItem {
    return this.item;
  };
};