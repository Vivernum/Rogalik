import { KAPLAYCtxT, GameObj, PosComp, HealthComp, AnimateComp, NavMesh, PathfinderComp, PatrolComp } from "kaplay";
import { createHelthBar } from "../utils/healthBar";
import { createParticles } from "../utils/collisionParticles";
import { createCircularParticles } from "../utils/createCircularParticles";
import { IPlayerEnemyActions, TPlayer } from "./CPlayer";

export type EnemyActionsPull = 'patrol' | 'return' | 'attack' | 'pursuit';

export interface EnemyComp {
  speed: number;
  prey: TPlayer | null;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  attackDamage: number;
  attackDuration: number;
  action: EnemyActionsPull;
};

export type TShriker = GameObj<PosComp | HealthComp | EnemyComp>;

export class Shriker {
  protected enemy: TShriker;

  constructor(
    protected k: KAPLAYCtxT,
    protected startingPos: number[],
    protected player: IPlayerEnemyActions,
  ) {
    k.loadSprite('enemy', 'sprites/Entities/shriker.png', {
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
      k.sprite('enemy', {anim: 'idle'}),
      k.pos(startingPos[0], startingPos[1]),
      k.anchor(k.vec2(0, 0)),
      k.health(100, 100),
      k.sentry({
        include: 'player',
      }, {
        lineOfSight: true,
        raycastExclude: ['enemy', 'weapon', 'projectile'],
        direction: -90,
        fieldOfView: 359,
        checkFrequency: 0.5,
      }),
      k.area({
        shape: new k.Circle(k.vec2(0, 0), 16),
      }),
      k.body(),
      'enemy',
      'shriker',
      {
        speed: 150,
        prey: null,
        attackRange: 65,
        attackCooldown: 1.2,
        lastAttackTime: 0,
        attackDamage: 20,
        attackDuration: 0.5,
        action: 'patrol' as EnemyActionsPull,

        add() {
          this.onObjectsSpotted((objects: GameObj[]) => {
            const player = objects.find((o: TPlayer) => o.is('player'));
            if(player && this.action !== 'pursuit') {
              this.prey = player;
              this.action = 'pursuit';
            }
          });
        },


        update() {
          this.lastAttackTime += k.dt();
          // if target exists only then we switch behaviour else we get error which is bad
          if(this.prey) {
            const player: TPlayer = this.prey;
            const distance = this.pos.dist(player.pos);

            switch(this.action) {
              case 'patrol': {
                this.patrolBehavior();
                break;
              };
              case 'pursuit': {
                if (distance <= this.attackRange) {
                  this.action = 'attack';
                } else {
                  this.pursuitBehavior(this.prey);
                };
                break;
              };
              case 'attack': {
                if (distance > this.attackRange) {
                  this.action = 'pursuit';
                } else {
                  this.attackBehahivor(this.prey);
                };
                break;
              };
            };
          };
        },

        pursuitBehavior(player: TPlayer) {
          this.moveTo(player.pos, this.speed);
        },

        attackBehahivor(player: TPlayer) {
          this.moveTo(player.pos, this.speed);
          if (this.lastAttackTime >= this.attackCooldown) {
            this.play('attack');
            k.tween(
              0,
              (this.attackRange + 30) / 2,
              this.attackDuration,
              (radius: number) => {
                hittingCircle.radius = radius;
                hittingCircle.use(k.area({
                  shape: new k.Circle(k.vec2(0, 0), radius),
                }));
                if (radius === (this.attackRange + 30) / 2) {
                  createCircularParticles(k, this.pos, radius, 70, k.RED)
                };
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
              hittingCircle.use(k.area({
                shape: new k.Circle(k.vec2(0, 0), 0),
              }));
            });
            this.lastAttackTime = 0;
          };
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
      'damageCollider',
    ]);

    hittingCircle.onCollide('player', () => {
      this.player.damageHandler(this.enemy.attackDamage);
    });

    this.enemy.onHurt(() => {
      healthBarFill.width = (this.enemy.hp / this.enemy.maxHP) * 40;
    })

    this.enemy.onDeath(() => {
      createParticles(k, this.enemy.pos, 20, k.RED);
      this.enemy.destroy();
    });
  };
}