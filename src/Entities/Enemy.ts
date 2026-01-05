import { KAPLAYCtxT, GameObj, PosComp, HealthComp } from "kaplay";
import { createHelthBar } from "../utils/healthBar";
import { createParticles } from "../utils/collisionParticles";
import { createCircularParticles } from "../utils/createCircularParticles";

export function createEnemy(k: KAPLAYCtxT, [enemyStartingPositionX, enemyStartingPositionY]: number[]) {
  k.loadSprite('enemy', 'sprites/Entities/dio.png');
  k.loadSprite('sword', 'sprites/Weapons/sword.png');

  const enemy = k.add([
    k.sprite('enemy'),
    k.pos(enemyStartingPositionX, enemyStartingPositionY),
    k.anchor(k.vec2(0, 0)),
    k.health(100, 100),
    k.sentry({
      include: 'player',
    }, {
      lineOfSight: true,
      raycastExclude: ['enemy', 'weapon', 'projectile'],
      direction: k.vec2(1, 1),
      fieldOfView: 359,
      checkFrequency: 0.5,
    }),
    k.area({
      shape: new k.Circle(k.vec2(0, 0), 20),
    }),
    k.body(),
    'enemy',
    {
      speed: 150,
      prey: null,
      attackRange: 50,
      sightRange: 300,
      isInSrartPosition: false,
      attackCooldown: 1.5,
      lastAttackTime: 0,
      attackDamage: 10,
      attackDuration: 0.3,
      action: 'patrol',
      swordDirection: k.vec2(0, 0),
      attackAngle: 0,
      collisionCount: 0,

      add() {
        this.onObjectsSpotted((objects: GameObj[]) => {
          const player = objects.find((o: GameObj) => o.is('player'));
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
          const player: GameObj<PosComp> = this.prey;
          const distance = enemy.pos.dist(player.pos);

          // this.swordDirection = this.prey.pos.sub(this.pos).unit();
          // this.attackAngle = this.swordDirection.angle();
          // if sentry is not in x0y0 position it considered to wandering seeking for player
          if (
            this.pos.x !== enemyStartingPositionX &&
            this.pos.y !== enemyStartingPositionY
          ) {
            this.isInSrartPosition = false
          } else {
            this.isInSrartPosition = true
          };

          if (
            !this.hasLineOfSight(this.prey) &&
            !this.isInSrartPosition &&
            this.action !== 'return'
          ) {
            this.action = 'return';
          } else if  (
            !this.hasLineOfSight(this.prey) &&
            this.isInSrartPosition &&
            this.action !== 'patrol'
          ) {
            this.action = 'patrol';
          };

          switch(this.action) {
            case 'patrol': {
              this.patrolBehavior();
              break;
            };
            case 'pursuit': {
              if (distance <= this.attackRange) {
                this.action = 'attack';
              } else if (distance > this.sightRange) {
                this.action = 'return';
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
            case 'return': {
              this.returnBehavior();
              break;
            };
          };
        };
      },
      
      
      patrolBehavior() {
        
      },
      
      pursuitBehavior(player: GameObj) {
        this.moveTo(player.pos, this.speed);
      },
      // нужно будет добавить такие варианты как returning и тд, чтобы оптимизировать операции здесь
      returnBehavior() {
        this.moveTo(enemyStartingPositionX, enemyStartingPositionY, this.speed);
      },
      attackBehahivor(player: GameObj<PosComp | HealthComp>) {
        if (this.lastAttackTime >= this.attackCooldown) {
          k.tween(
            0,
            (this.attackRange + 20) / 2,
            this.attackDuration,
            (radius: number) => {
              hittingCircle.radius = radius;
              hittingCircle.use(k.area({
                shape: new k.Circle(k.vec2(0, 0), radius),
              }));
              if (radius === (this.attackRange + 20) / 2) {
                createCircularParticles(k, enemy.pos, radius, 50, k.RED)
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
          this.collisionCount = 0;
        };
      },

    },
  ]);
  
  const healthBarFill = createHelthBar(k, enemy, k.vec2(0, -35));

  const hittingCircle = enemy.add([
    k.pos(0, 0),
    k.anchor("center"),
    k.circle(0),
    k.z(-Infinity),
    k.area({
      shape: new k.Circle(k.vec2(0, 0), 0),
    }),
    k.outline(3, k.BLACK),
    'damageCollider',
  ]);

  hittingCircle.onCollide('player', (player: GameObj<HealthComp>) => {
    enemy.collisionCount += 1;
    if(enemy.collisionCount === 1) {
      player.hp -= enemy.attackDamage;
    };
  });

  enemy.onHurt((damage: number) => {
    healthBarFill.width = (enemy.hp / enemy.maxHP) * 60;
  })

  enemy.onDeath(() => {
    createParticles(k, enemy.pos, 20, k.RED);
    enemy.destroy();
  });

  return enemy;
};