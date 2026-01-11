import { ColorComp, GameObj, KAPLAYCtxT, OutlineComp, PosComp, RectComp, SpriteComp } from "kaplay";
import { THealthPotion } from "../Items/healthPotion";

export interface IInventory {
  isInventoryOpen: boolean,
  renderIventory: () => void,
  closeInventory: () => void,
  equip: (item: GameObj) => void,
  unEquip: (item: GameObj) => void,
};

export class Inventory implements IInventory{
  public isInventoryOpen: boolean = false;
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
    // for (let i = 0; i < this.inventoryLimit; i++) {
    //   this.itemsList.push([null, null, null, null]);
    // };
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
          this.k.color('gray'),
          this.k.opacity(0.5),
          this.k.outline(5, this.k.BLACK),
          this.k.pos(40 + 110 * j, this.k.height() - 145 - 110 * i),
        ]);
        this.inventory[i][j] = item;
      };
    };
    this.isInventoryOpen = true;
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