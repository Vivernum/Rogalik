import { KAPLAYCtxT, GameObj } from "kaplay";
import { createHelthBar } from "../utils/healthBar";
import { createParticles } from "../utils/collisionParticles";
import { createCircularParticles } from "../utils/createCircularParticles";
import { IPlayerEnemyActions, TPlayer } from "../types/player";
import { TShriker } from "../types/ememies";
import { EnemyActionsPull } from "../types/ememies";
import { AllDamageTypes } from "../types/stats";
import { calculateReceivedDamage } from "../utils/damageController";

export class Shriker {
  protected enemy: TShriker;

  constructor(
    protected k: KAPLAYCtxT,
    protected startingPos: number[],
    protected player: IPlayerEnemyActions,
  ) {
    k.loadSprite("enemy", "sprites/Entities/shriker.png", {
      sliceX: 12,
      sliceY: 1,
      anims: {
        idle: {
          from: 0,
          to: 2,
          loop: true,
          pingpong: true,
        },
        attack: {
          from: 3,
          to: 11,
          loop: false,
          speed: 14,
        },
      },
    });

    this.enemy = k.add([
      k.sprite("enemy", { anim: "idle" }),
      k.pos(startingPos[0], startingPos[1]),
      k.anchor(k.vec2(0, 0)),
      k.health(100, 100),
      k.sentry(
        {
          include: "player",
        },
        {
          lineOfSight: true,
          raycastExclude: ["enemy", "weapon", "projectile"],
          direction: -90,
          fieldOfView: 359,
          checkFrequency: 0.5,
        },
      ),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 16),
      }),
      k.body(),
      "enemy",
      "shriker",
      {
        speed: 150,
        prey: null,
        attackRange: 65,
        attackCooldown: 1.2,
        lastAttackTime: 0,
        attackStats: {
          physicalDamage: 20,
          fireDamage: 0,
          coldDamage: 0,
          darkDamage: 0,
          lightDamager: 0,
        },
        resistanceStats: {
          physicalResistance: 0,
          fireResistance: 0,
          coldResistance: 0,
          darkResistance: 0,
          lightResistance: 0,
        },
        attackDuration: 0.5,
        action: EnemyActionsPull.Patrol,

        add() {
          this.onObjectsSpotted((objects: GameObj[]) => {
            const player = objects.find((o: TPlayer) => o.is("player"));
            if (player && this.action !== EnemyActionsPull.Pursuit) {
              this.prey = player;
              this.action = EnemyActionsPull.Pursuit;
            }
          });
        },

        update() {
          this.lastAttackTime += k.dt();
          // if target exists only then we switch behaviour else we get error which is bad
          if (this.prey) {
            const player: TPlayer = this.prey;
            const distance = this.pos.dist(player.pos);

            switch (this.action) {
              case EnemyActionsPull.Patrol: {
                this.patrolBehavior();
                break;
              }
              case EnemyActionsPull.Pursuit: {
                if (distance <= this.attackRange) {
                  this.action = EnemyActionsPull.Attack;
                } else {
                  this.pursuitBehavior(this.prey);
                }
                break;
              }
              case EnemyActionsPull.Attack: {
                if (distance > this.attackRange) {
                  this.action = EnemyActionsPull.Pursuit;
                } else {
                  this.attackBehahivor(this.prey);
                }
                break;
              }
            }
          }
        },

        pursuitBehavior(player: TPlayer) {
          this.moveTo(player.pos, this.speed);
        },

        attackBehahivor(player: TPlayer) {
          this.moveTo(player.pos, this.speed);
          if (this.lastAttackTime >= this.attackCooldown) {
            this.play("attack");
            k.tween(
              0,
              (this.attackRange + 30) / 2,
              this.attackDuration,
              (radius: number) => {
                hittingCircle.radius = radius;
                hittingCircle.use(
                  k.area({
                    shape: new k.Circle(k.vec2(0, 0), radius),
                  }),
                );
                if (radius === (this.attackRange + 30) / 2) {
                  createCircularParticles(k, this.pos, radius, 70, k.RED);
                }
              },
              k.easings.linear,
            ).then(() => {
              k.tween(
                (this.attackRange + 10) / 2,
                0,
                this.attackDuration,
                (radius: number) => {
                  hittingCircle.radius = radius;
                },
                k.easings.linear,
              );
              hittingCircle.use(
                k.area({
                  shape: new k.Circle(k.vec2(0, 0), 0),
                }),
              );
            });
            this.lastAttackTime = 0;
          }
        },


        takeDamage(damage: AllDamageTypes) {
          this.hp -= calculateReceivedDamage(damage, this.resistanceStats);
        },
      },
    ]);

    const healthBarFill = createHelthBar(k, this.enemy, k.vec2(0, -25));

    const hittingCircle = this.enemy.add([
      k.pos(0, 0),
      k.anchor("center"),
      k.circle(0, {
        fill: false,
      }),
      k.z(-99),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 0),
      }),
      k.outline(2, k.BLACK),
      "damageCollider",
    ]);

    hittingCircle.onCollide("player", () => {
      this.player.damageHandler(this.enemy.attackStats);
    });

    this.enemy.onHurt(() => {
      healthBarFill.width = (this.enemy.hp / this.enemy.maxHP) * 40;
    });

    this.enemy.onDeath(() => {
      createParticles(k, this.enemy.pos, 20, k.RED);
      this.enemy.destroy();
    });
  }
}
