import { ColorComp, GameObj, KAPLAYCtxT, Key, OutlineComp, PosComp, RectComp, SpriteComp, Vec2 } from "kaplay";
import { HealthPotion, THealthPotion } from "../Items/healthPotion";
import { fail } from "node:assert";

export interface IInventory {
  isInventoryOpen: boolean,
  renderIventory: () => void,
  closeInventory: () => void,
  equip: (item: THealthPotion) => void,
  unEquip: (pos: Vec2) => void,
};

export class Inventory implements IInventory {
  public isInventoryOpen: boolean = false;
  protected currentItem: number[] = [0, 0];
  protected itemsList: THealthPotion[][] | null[][] = [
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

  protected rerenderInventory(): void {
    this.closeInventory();
    this.renderIventory();
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
          this.k.anchor('center'),
          this.k.outline(5, this.k.BLACK),
          this.k.pos(90 + 110 * j, this.k.height() - 310 + 110 * i),
        ]);
        if (this.itemsList[i][j]) {
          item.add([
            this.k.sprite(this.itemsList[i][j].sprite),
            this.k.pos(0, 0),
            this.k.stay(),
            this.k.scale(4),
            this.k.anchor('center'),
            this.k.z(11),
          ]);
        }
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
          this.rerenderInventory();
          break;
        };
        this.currentItem[1] -= 1;
        this.rerenderInventory();
        break;
      }
      case 'right': {
        if (this.currentItem[1] === this.inventoryLimit - 1) {
          this.currentItem[1] = 0;
          this.rerenderInventory();
          break;
        };
        this.currentItem[1] += 1;
        this.rerenderInventory();
        break;
      }
      case 'up': {
        if (this.currentItem[0] === 0) {
          this.currentItem[0] = this.inventoryLimit - 1;
          this.rerenderInventory();
          break;
        };
        this.currentItem[0] -= 1;
        this.rerenderInventory();
        break;
      }
      case 'down': {
        if (this.currentItem[0] === this.inventoryLimit - 1) {
          this.currentItem[0] = 0;
          this.rerenderInventory();
          break;
        };
        this.currentItem[0] += 1;
        this.rerenderInventory();
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
    this.placeItem(item);
    // item.isEquipped = true;
    // item.opacity = 0;
    if (this.isInventoryOpen) {
      this.rerenderInventory();
    };
  };

  unEquip(pos: Vec2): void {
    const item = this.itemsList[this.currentItem[0]][this.currentItem[1]]; 
    if (item) {
      const some = new HealthPotion(this.k, [pos.x, pos.y], this);
      // item.pos = pos;
      // item.opacity = 1;
      // item.isEquipped = false;
      this.itemsList[this.currentItem[0]][this.currentItem[1]] = null;
      this.rerenderInventory();
    };
  };

  protected placeItem(item: THealthPotion): void {
    for (let i = 0; i < this.inventoryLimit; i++) {
      const currentIndex = this.itemsList[i].indexOf(null);
      if (currentIndex !== -1) {
        this.itemsList[i][currentIndex] = item;
        return;
      };
    };
    // здесь будет метод для возврата предмета, если нет места в инвентаре
  };
};