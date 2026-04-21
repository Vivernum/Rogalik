import { KAPLAYCtxT, Vec2 } from "kaplay";
import { Weapon } from "./Weapon";
import { createBallsThrowerProjectile } from "../projectiles/createBallsThrowerProjectile";
import { AllDamageTypes, PlayersStatsType } from "../types/stats";

export class BallsThrower extends Weapon {
  firingRate: number = 0.4;
  damage: Partial<AllDamageTypes> = {
    physicalDamage: 20,
  };

  constructor(public k: KAPLAYCtxT) {
    super(k);
  }

  takeShot(
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersStatsType,
  ) {
    if (this.timePassedSinceLastShot < this.firingRate) return;
    createBallsThrowerProjectile(
      this.k,
      position,
      direction,
      angle,
      this.damage,
    );
    this.timePassedSinceLastShot = 0;
  }
}
