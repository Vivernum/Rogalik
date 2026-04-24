import { KAPLAYCtxT, Vec2 } from "kaplay";
import { Weapon } from "./Weapon";
import { createBallsThrowerProjectile } from "../projectiles/createBallsThrowerProjectile";
import { PartialAllAttackStatsType, PlayersAtackStatsType } from "../types/stats";
import { EffectCallbackResultType, EffectsType, EnemyUseEffectCallbackType } from "../types/effect";
import { EnemyComp } from "../types/ememies";

export class BallsThrower extends Weapon {
  firingRate: number = 0.4;
  damage: PartialAllAttackStatsType = {
    physicalDamage: 20,
  };
  effectType: EffectsType = EffectsType.COLD;
  effectCallback: EnemyUseEffectCallbackType = (entity: EnemyComp) => {
    entity.speed *= 0.5;
    let id: number;
    let promise: Promise<void> = new Promise((resolve) => {
      id = setTimeout(() => {
        resolve();
      }, 5000);
    });

    return {
      stop: () => {
        clearTimeout(id);
        entity.speed /= 0.5;
        console.log(entity.speed,);
      },
      onEnd: promise,
    }
  }

  constructor(public k: KAPLAYCtxT) {
    super(k);
  }

  takeShot(
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersAtackStatsType,
  ) {
    if (this.timePassedSinceLastShot < this.firingRate) return;
    createBallsThrowerProjectile(
      this.k,
      position,
      direction,
      angle,
      {
        ...attackStats,
        ...this.damage,
      },
      this.effectCallback,
      this.effectType,
    );
    this.timePassedSinceLastShot = 0;
  }
}
