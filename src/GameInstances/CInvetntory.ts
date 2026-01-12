import { ColorComp, GameObj, KAPLAYCtxT, Key, OutlineComp, PosComp, RectComp, SpriteComp } from "kaplay";
import { THealthPotion } from "../Items/healthPotion";

export interface IInventory {
  isInventoryOpen: boolean,
  renderIventory: () => void,
  closeInventory: () => void,
  equip: (item: GameObj) => void,
  unEquip: (item: GameObj) => void,
};

export class Inventory implements IInventory {
  public isInventoryOpen: boolean = false;
  protected currentItem: number[] = [0, 0];
  protected itemsList: GameObj[][] | null[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  protected inventory: GameObj[][] | null[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  protected inventoryLimit: number = 3;

  constructor(
    protected k: KAPLAYCtxT,
  ) {
    const listener = this.k.add([
      k.pos(0, 0),
      k.rect(1, 1),
      k.z(-Infinity),
      k.opacity(0),
      k.area(),
      k.stay(),
    ]);

    listener.onKeyPress(['left', 'right', 'down', 'up'], (key: Key) => {
      if (this.isInventoryOpen) {
        this.swithCurrentItem(key);
      };
    });
  };

  renderIventory(): void {
    for (let i = 0; i < this.inventoryLimit; i++) {
      for (let j = 0; j < this.inventoryLimit; j++) {
        const item = this.k.add([
          this.k.rect(100, 100, {
            radius: 5,
          }),
          this.k.fixed(),
          this.k.stay(),
          this.k.z(10),
          this.k.color(this.currentItem[0] === i && this.currentItem[1] === j ? 'yellow' : 'gray'),
          this.k.opacity(0.5),
          this.k.outline(5, this.k.BLACK),
          this.k.pos(40 + 110 * j, this.k.height() - 360 + 110 * i),
        ]);
        this.inventory[i][j] = item;
      };
    };

    this.isInventoryOpen = true;
  };

  protected swithCurrentItem(key: Key): void {
    switch (key) {
      case 'left':{
        if (this.currentItem[1] === 0) {
          this.currentItem[1] = this.inventoryLimit - 1;
          this.closeInventory();
          this.renderIventory();
          break;
        };
        this.currentItem[1] -= 1;
        this.closeInventory();
        this.renderIventory();
        break;
      }
      case 'right': {
        if (this.currentItem[1] === this.inventoryLimit - 1) {
          this.currentItem[1] = 0;
          this.closeInventory();
          this.renderIventory();
          break;
        };
        this.currentItem[1] += 1;
        this.closeInventory();
        this.renderIventory();
        break;
      }
      case 'up': {
        if (this.currentItem[0] === 0) {
          this.currentItem[0] = this.inventoryLimit - 1;
          this.closeInventory();
          this.renderIventory();
          break;
        };
        this.currentItem[0] -= 1;
        this.closeInventory();
        this.renderIventory();
        break;
      }
      case 'down': {
        if (this.currentItem[0] === this.inventoryLimit - 1) {
          this.currentItem[0] = 0;
          this.closeInventory();
          this.renderIventory();
          break;
        };
        this.currentItem[0] += 1;
        this.closeInventory();
        this.renderIventory();
        break;
      }
    };
  };

  closeInventory(): void {
    for (let i = 0; i < this.inventoryLimit; i++) {
      for (let j = 0; j < this.inventoryLimit; j++) {
        this.inventory[i][j].destroy();
        this.inventory[i][j] = null;
      };
    };
    this.isInventoryOpen = false;
  }

  equip(item: THealthPotion): void {
    console.log('picked!');
  };

  unEquip(item: THealthPotion): void {

  };
}