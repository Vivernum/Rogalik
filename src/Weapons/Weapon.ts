import { KAPLAYCtxT, Vec2 } from "kaplay";
import { IWeapon } from "../types/weapon";

export abstract class Weapon implements IWeapon {
  firingRate: number;
  timePassedSinceLastShot: number = 0;
  damage: number;

  constructor(public k: KAPLAYCtxT) {
    const listener = this.k.add([
      k.pos(0, 0),
      k.rect(1, 1),
      k.z(-Infinity),
      k.opacity(0),
      k.area(),
      k.stay(),
    ]);

    listener.onUpdate(() => {
      this.timePassedSinceLastShot += this.k.dt();
    });
  }

  takeShot(pos: Vec2, dir: Vec2, angle: number) {}
}
