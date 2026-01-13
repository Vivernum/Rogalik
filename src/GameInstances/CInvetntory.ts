import { GameObj, KAPLAYCtxT, Key, Vec2 } from "kaplay";
import { TPlayer } from "../Entities/CPlayer";
import { TItem } from "../Items/CItem";
import { IItemProvider } from "../Items/ItemProvider";
import { TItemNames } from "../Items/CItem";

export interface IInventory {
  isInventoryOpen: boolean,
  isINventoryFull: boolean,
  renderIventory: () => void,
  closeInventory: () => void,
  equip: (item: TItem) => void,
  unEquip: (pos: Vec2) => void,
  useItem: (player: TPlayer) => void,
};

export class Inventory implements IInventory {
  public isInventoryOpen: boolean = false;
  public isINventoryFull: boolean = false;
  protected currentItem: number[] = [0, 0];
  protected itemsList: TItem[][] | null[][] = [
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
    protected provider: IItemProvider,
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

  equip(item: TItem): void {
    this.placeItem(item);
    this.validateInventory();
    if (this.isInventoryOpen) {
      this.rerenderInventory();
    };
  };

  protected spawnItem(item: TItem, pos: Vec2): TItem{
    return this.provider.defineItem(item.sprite as TItemNames, pos, this);
  }

  unEquip(pos: Vec2): void {
    const item = this.itemsList[this.currentItem[0]][this.currentItem[1]]; 
    if (item) {
      const some = this.spawnItem(item, pos);
      this.itemsList[this.currentItem[0]][this.currentItem[1]] = null;
      this.isINventoryFull = false;
      this.rerenderInventory();
    };
  };

  useItem(player: TPlayer): void {
    const item = this.itemsList[this.currentItem[0]][this.currentItem[1]];
    if (item) {
      item.callback(player, this.k);
      this.itemsList[this.currentItem[0]][this.currentItem[1]] = null;
      this.rerenderInventory();
    };
  };

  protected placeItem(item: TItem): void {
    for (let i = 0; i < this.inventoryLimit; i++) {
      const currentIndex = this.itemsList[i].indexOf(null);
      if (currentIndex !== -1) {
        this.itemsList[i][currentIndex] = item;
        return;
      };
    };
  };

  protected validateInventory(): void {
    for (let i = 0; i < this.inventoryLimit; i++) {
      const currentIndex = this.itemsList[i].indexOf(null);
      if (currentIndex !== -1) {
        this.isINventoryFull = false;
      } else {
        this.isINventoryFull = true;
      };
    };
  };
};