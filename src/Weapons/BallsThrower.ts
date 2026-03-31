import { KAPLAYCtxT, Vec2 } from "kaplay";
import { Weapon } from "./Weapon";
import { createBallsThrowerProjectile } from "../projectiles/createBallsThrowerProjectile";


export class BallsThrower extends Weapon {
  firingRate: number = 0.4;
  damage: number = 30;

  constructor (
    public k: KAPLAYCtxT,
  ) {
    super(k);
  };

  takeShot(
    pos: Vec2,
    dir: Vec2,
    angle: number,
  ) {
    // console.log(this.timePassedSinceLastShot)
    if (this.timePassedSinceLastShot < this.firingRate) return;
    createBallsThrowerProjectile(this.k, pos, dir, angle, this.damage);
    this.timePassedSinceLastShot = 0;
  };
};