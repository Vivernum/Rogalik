import { KAPLAYCtxT, Vec2 } from "kaplay";
import { createParticles } from "../particles/collisionParticles";
import {
  TPlayer,
  IPlayer,
} from "../types/player";
import { IWeapon } from "../types/weapon";
import { BallsThrower } from "../Weapons/BallsThrower";
import { calculateReceivedDamage } from "../utils/calculateRecievedDamage";
import {
  PartialEnemyAttackStatsType,
} from "../types/stats";
import { IPlayersAttackStatsController, IResistanceStatsController } from "../types/controllers";
import { PlayerAttackStatsController } from "../utils/controllers/attackStatsControllers";
import ResistanceStatsController from "../utils/controllers/resistanceStatsController";
import { IPlayerEffectController, PlayerEffectPayloadType } from "../types/effect";
import { PlayerEffectsController } from "../utils/controllers/effectsController";

const START_HEALTH = 100;

export class Player implements IPlayer {
  public player: TPlayer;
  public maxHealth: number = 100;
  public hitCooldown: number = 1;
  public timePassedSinceLastHit: number = 0;
  public speed: number = 200;
  public equipedWeapon: IWeapon;
  public attackStatsController: IPlayersAttackStatsController = new PlayerAttackStatsController();
  public resistanceStatsController: IResistanceStatsController = new ResistanceStatsController();
  public effectsController: IPlayerEffectController = new PlayerEffectsController();

  constructor(
    protected k: KAPLAYCtxT,
    protected position: number[],
  ) {
    this.equipedWeapon = new BallsThrower(this.k);

    const movementDirections: Record<string, Vec2> = {
      w: k.UP,
      d: k.RIGHT,
      s: k.DOWN,
      a: k.LEFT,
    };

    k.loadSprite("jotaro", "sprites/Entities/jotaro.png", {
      sliceX: 4,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 3,
          loop: true,
          pingpong: true,
        },
      },
    });
    k.loadSprite("projectile", "sprites/Weapons/attack.png", {
      sliceX: 5,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 4,
          loop: true,
        },
      },
    });

    this.player = k.add([
      k.sprite("jotaro", {
        anim: "idle",
      }),
      k.pos(this.position[0], this.position[1]),
      k.health(START_HEALTH, this.maxHealth),
      k.anchor("center"),
      k.opacity(1),
      k.stay(),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 14),
      }),
      k.body(),
      "player",
    ]);

    for (const key in movementDirections) {
      this.player.onKeyDown(key, () => {
        this.player.move(movementDirections[key].scale(this.speed));
      });
    }

    const shadow = this.player.add([
      this.k.anchor(this.k.vec2(0, -2.5)),
      this.k.ellipse(16, 6),
      this.k.color(k.BLACK),
      this.k.opacity(0.4),
      this.k.z(-1),
    ]);

    this.player.onUpdate(() => {
      k.setCamPos(this.player.pos);
      k.setCamScale(2.3);
      k.setCamRot(0);

      this.timePassedSinceLastHit += k.dt();
    });

    this.player.onMouseDown(() => {
      this.useWeapon();
    });

    this.player.onKeyPress("space", () => {
      this.useWeapon();
    });

    this.player.onDeath(() => {
      createParticles(k, this.player.pos, 20, k.RED);
      this.player.destroy();
    });
  }

  // Method to handle player damage
  damageHandler(attackStats: PartialEnemyAttackStatsType, effectPayload?: PlayerEffectPayloadType): void {
    if (this.timePassedSinceLastHit > this.hitCooldown) {
      if (effectPayload) this.effectsController.addEffect(effectPayload, this);
      this.player.hp -= calculateReceivedDamage(
        attackStats,
        this.resistanceStatsController.getResistanceStats(),
      );
      this.timePassedSinceLastHit = 0;
    }
    return;
  }

  useWeapon(): void {
    const shotDirection = this.k
      .toWorld(this.k.mousePos())
      .sub(this.player.pos)
      .unit()
      .scale(2000);
    const shotAngle = this.k
      .toWorld(this.k.mousePos())
      .sub(this.player.pos)
      .angle();
    this.equipedWeapon.takeShot(
      this.player.pos,
      shotDirection,
      shotAngle,
      this.attackStatsController.getDamageStats(),
    );
  }
}
