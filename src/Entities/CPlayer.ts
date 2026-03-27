import { KAPLAYCtxT, Vec2 } from "kaplay";
import { createParticles } from "../utils/collisionParticles";
import { TWeapon } from "../Weapons/CWeapon";
import { TPlayer, IPlayerEnemyActions, IPlayerWeaponActions } from "../types/player";
import { createProjectile } from "../Weapons/Bullets/projectile";

export class Player implements IPlayerEnemyActions, IPlayerWeaponActions {
  public player: TPlayer;
  private hitCooldown: number = 1;
  private timePassedSinceLastHit: number = 0;
  private equipedWeapon: null | TWeapon = null;
  private speed: number = 200;
  private firingTempo: number = 0.5;
  private lastShotTime: number = 0;

  constructor(
    protected k: KAPLAYCtxT,
    protected pos: number[],
  ) {

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
        shape: new k.Circle(k.vec2(0, 0), 16),
      }),
      k.body(),
      'player',
    ]);

    for (const key in movementDirections) {
      this.player.onKeyDown(key, () => {;
        this.player.move(movementDirections[key].scale(this.speed));
      });
    };

    this.player.onUpdate(() => {
      k.setCamPos(this.player.pos);
      k.setCamScale(2.3);
      k.setCamRot(0);

      this.timePassedSinceLastHit += k.dt();
      this.lastShotTime += k.dt();

    });

    this.player.onMouseDown(() => {
      this.takeShot();
    });

    this.player.onKeyPress('space', () => {
      this.takeShot();
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

  takeShot(): void {
    if (this.lastShotTime < this.firingTempo) return;
    const dir = this.k.toWorld(this.k.mousePos()).sub(this.player.pos).unit().scale(2000);
    const projectile = createProjectile(this.k, this.player.pos, dir, this.equipedWeapon ? this.equipedWeapon.baseDamage : 20);
    this.lastShotTime = 0;
  };
};