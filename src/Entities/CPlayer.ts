import { KAPLAYCtxT, Vec2 } from "kaplay";
import { createParticles } from "../utils/collisionParticles";
import { TPlayer, IPlayerEnemyActions, IPlayerWeaponActions } from "../types/player";
import { createProjectile } from "../Weapons/Bullets/projectile";
import { AttackStatsType, ResistanceStatsType } from "../types/stats";
import { IWeapon } from "../types/weapon";
import { BallsThrower } from "../Weapons/BallsThrower";

export class Player implements IPlayerEnemyActions, IPlayerWeaponActions {
  public player: TPlayer;
  private hitCooldown: number = 1;
  private timePassedSinceLastHit: number = 0;
  private walkingSpeed: number = 200;
  private equipedWeapon: IWeapon;
  private attackStats: AttackStatsType = {
    physicalDamage: 20,
    fireDamageMultiplier: 1,
    coldDamageMultiplier: 1,
    darkDamageMultiplier: 1,
    lightDamageMultiplier: 1,
  };
  private resistanceStats: ResistanceStatsType = {
    physicalResistance: 0,
    fireResistanceMultiplier: 0,
    coldResistanceMultiplier: 0,
    darkResistanceMultiplier: 0,
    lightResistanceMultiplier: 0,
  };

  constructor(
    protected k: KAPLAYCtxT,
    protected pos: number[],
  ) {

    this.equipedWeapon = new BallsThrower(this.k);

    const movementDirections = {
      'w': k.UP,
      'd': k.RIGHT,
      's': k.DOWN,
      'a': k.LEFT,
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
        }
      }
    });
    k.loadSprite('projectile', 'sprites/Weapons/attack.png', {
      sliceX: 5,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 4,
          loop: true,
        }
      }
    });

    this.player = k.add([
      k.sprite("jotaro", {
        anim: 'idle',
      }),
      k.pos(this.pos[0], this.pos[1]),
      k.health(100, 100),
      k.anchor('center'),
      k.opacity(1),
      k.stay(),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 14),
      }),
      k.body(),
      'player',
    ]);

    for (const key in movementDirections) {
      this.player.onKeyDown(key, () => {;
        this.player.move(movementDirections[key].scale(this.walkingSpeed));
      });
    };

    this.player.onUpdate(() => {
      k.setCamPos(this.player.pos);
      k.setCamScale(2.3);
      k.setCamRot(0);

      this.timePassedSinceLastHit += k.dt();

    });

    this.player.onMouseDown(() => {
      this.useWeapon();
    });

    this.player.onKeyPress('space', () => {
      this.useWeapon();
    });


    this.player.onDeath(() => {
      createParticles(k, this.player.pos, 20, k.RED);
      this.player.destroy();
    });
  };

  // Method to handle player damage
  damageHandler(damage: number): void {
    if (this.timePassedSinceLastHit > this.hitCooldown) {
      this.player.hp -= damage;
      this.timePassedSinceLastHit = 0;
    } else {
      return;
    };
  };

  useWeapon(): void {
    const shotDirection = this.k.toWorld(this.k.mousePos()).sub(this.player.pos).unit().scale(2000);
    const shotAngle = this.k.toWorld(this.k.mousePos()).sub(this.player.pos).angle()
    this.equipedWeapon.takeShot(this.player.pos, shotDirection, shotAngle)
  };
};