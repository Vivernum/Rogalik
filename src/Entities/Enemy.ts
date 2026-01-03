import { KAPLAYCtxT, GameObj, PosComp, LevelComp, HealthComp } from "kaplay";
import { createHelthBar } from "../utils/healthBar";

export function createEnemy(k: KAPLAYCtxT, l: GameObj<PosComp | LevelComp>, [enemyStartingPositionX, enemyStartingPositionY]: number[]) {
  k.loadSprite('enemy', 'sprites/Entities/dio.png');
  k.loadSprite('sword', 'sprites/Weapons/sword.png');

  const enemy = k.add([
    k.sprite('enemy'),
    k.pos(enemyStartingPositionX, enemyStartingPositionY),
    k.anchor(k.vec2(1, 0)),
    k.health(100, 100),
    k.sentry({
      include: 'player',
      distanceOp: 'near',
    }, {
      lineOfSight: true,
      raycastExclude: ['enemy', 'weapon', 'projectile', 'floor'],
      direction: k.vec2(-1, 1),
      fieldOfView: 90,
      checkFrequency: 0.5,
    }),
    k.area(),
    k.body(),
    'enemy',
    {
      speed: 150,
      prey: null,
      attackRange: 80,
      sightRange: 300,
      isInSrartPosition: false,
      attackCooldown: 1,
      lastAttackTime: 0,
      attackDamage: 10,
      action: 'patrol',

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


          // if sentry is not in x0y0 position it considered to wandering seeking for player
          if
          (
            enemy.pos.x !== enemyStartingPositionX &&
            enemy.pos.y !== enemyStartingPositionY
          ) {
            this.isInSrartPosition = false
          } else {
            this.isInSrartPosition = true
          };

          if
          (
            !this.hasLineOfSight(this.prey) &&
            !this.isInSrartPosition &&
            this.action !== 'return'
          ) {
            this.action = 'return';
          } else if 
          (
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
          player.hp -= this.attackDamage;
          this.attackAnimation();
          this.lastAttackTime = 0;
        };
      },
    
      attackAnimation() {
    
      },


    },
  ]);
  
  const healthBarFill = createHelthBar(k, enemy, k.vec2(-55, -40));

  enemy.add([
    k.sprite('sword'),
    k.anchor(k.vec2(0, 0)),
    k.rotate(0),
  ])

  enemy.onHurt((damage: number) => {
    healthBarFill.width = (enemy.hp / enemy.maxHP) * 60;
  })

  enemy.onDeath(() => {
    enemy.destroy();
  });

  return enemy;
};