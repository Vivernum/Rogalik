import { KAPLAYCtxT, Vec2 } from "kaplay";
import { IWeapon } from "../types/weapon";
import { PartialAllAttackStatsType, PlayersAtackStatsType } from "../types/stats";
import { EnemyEffectPayloadType } from "../types/effect";

export abstract class Weapon implements IWeapon {
  timePassedSinceLastShot: number = 0;
  firingRate!: number;
  damage!: PartialAllAttackStatsType;
  effectPayload!: EnemyEffectPayloadType;
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

  takeShot(
    position: Vec2,
    direction: Vec2,
    angle: number,
    attackStats: PlayersAtackStatsType,
  ) {}
}
