import { KAPLAYCtxT } from "kaplay";
import { Item } from "./CItem";
import { IInventory } from "../GameInstances/CInvetntory";
import { TItemNames } from "./CItem";
import { TPlayer } from "../Entities/CPlayer";

export class FireSpeedPotion extends Item {
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

  callback(player: TPlayer, k: KAPLAYCtxT): void {
    if (player.pickedWeapon) {
      player.pickedWeapon.firingFrequency -= 0.2;
      k.wait(10, () => {
        player.pickedWeapon.firingFrequency += 0.2;
      });
    }
  };
};