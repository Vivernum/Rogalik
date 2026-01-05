import { KAPLAYCtxT, GameObj, PosComp, LevelComp, HealthComp } from "kaplay";
import { createHelthBar } from "../utils/healthBar";

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
      attackCooldown: 1,
      lastAttackTime: 0,
      attackDamage: 10,
      attackDuration: 0.5,
      isAttackActive: false,
      action: 'patrol',
      sword: null,
      swordDirection: k.vec2(0, 0),
      attackAngle: 0,

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

          this.direction = this.prey.pos.sub(this.pos).unit();
          this.attackAngle = this.direction.angle();
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
        this.sword.rotateTo(this.attackAngle + 60);
      },
      // нужно будет добавить такие варианты как returning и тд, чтобы оптимизировать операции здесь
      returnBehavior() {
        this.moveTo(enemyStartingPositionX, enemyStartingPositionY, this.speed);
        this.sword.rotateTo(-45);
      },
      attackBehahivor(player: GameObj<PosComp | HealthComp>) {
        if (this.lastAttackTime >= this.attackCooldown) {
          this.isAttackActive = true;
          k.tween(
            this.sword.angle,
            Math.abs(this.attackAngle) > 90 ? this.attackAngle - 30 : this.attackAngle + 30,
            this.attackDuration,
            (val) => this.sword!.angle = val,
          ).then(() => {
            k.tween(
              this.sword!.angle,
              Math.abs(this.attackAngle) > 90 ? this.attackAngle + 30 : this.attackAngle - 30,
              this.attackDuration,
              (val) => this.sword!.angle = val,
            );
            this.isAttackActive = false;
          });
            this.lastAttackTime = 0;
        };
      },

    },
  ]);
  
  const healthBarFill = createHelthBar(k, enemy, k.vec2(0, -35));

  enemy.sword = enemy.add([
    k.sprite('sword'),
    k.pos(k.vec2(0, 0)),
    k.anchor(k.vec2(-1, -1)),
    k.rotate(-45),
    k.area(),
  ]);

  enemy.sword.onCollide('player', (player: GameObj<HealthComp>) => {
    if (enemy.isAttackActive) {
      player.hp -= enemy.attackDamage;
    } else return;
  });

  enemy.onHurt((damage: number) => {
    healthBarFill.width = (enemy.hp / enemy.maxHP) * 60;
  })

  enemy.onDeath(() => {
    enemy.destroy();
  });

  return enemy;
};