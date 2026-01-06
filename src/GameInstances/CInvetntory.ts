import { GameObj, KAPLAYCtxT, SpriteComp } from "kaplay";

export interface IInventory {

};

export class Inventory implements IInventory{
  protected itemsList: GameObj[];
  protected inventory: GameObj[] = [];
  protected inventoryLimit: number = 4;

  constructor(
    k: KAPLAYCtxT,
  ) {
    for (let i = 0; i < this.inventoryLimit; i++) {
      this.inventory.push(k.add([
        k.rect(70, 70, {
          radius: 5,
        }),
        k.stay(),
        k.fixed(),
        k.z(10),
        k.pos(30 + 80 * i, k.height() - 80),
        k.color('gray'),
        k.outline(5, k.BLACK),
        k.opacity(0.5),
        'inventory'
      ]));
    };
  };
}