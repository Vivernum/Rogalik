import { KAPLAYCtxT } from "kaplay";
import { IInventory } from "../GameInstances/CInvetntory";
import { TPlayer } from "../types/player";
import { Item, TItemNames } from "./CItem";

export class HealthPotion extends Item {
  constructor (
    protected k: KAPLAYCtxT,
    protected pos: number[],
    protected inventory: IInventory,
    protected sprite: TItemNames,
  ) {
    super(
      k,
      pos,
      inventory,
      sprite,
    );
  };

  callback(player: TPlayer): void {
    player.hp += 30;
  };
};