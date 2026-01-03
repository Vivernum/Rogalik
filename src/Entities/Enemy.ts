import { KAPLAYCtxT, GameObj, PosComp, LevelComp } from "kaplay";
import { createHelthBar } from "../utils/enemyHealthBar";

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
      sightRange: 300,
      isInSrartPosition: false,
      attackCooldown: 1,
      lastAttackTime: 0,
      attackDamage: 20,
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
        // if target exists only then we switch behaviour else we get error which is bad
        if(this.prey) {
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
              this.pursuitBehavior(this.prey);
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
    },
  ]);

  const [healthBar, healthBarFill] = createHelthBar(k, enemy);

  enemy.add([
    k.sprite('sword'),
    k.anchor(k.vec2(0, 0)),
  ])

  enemy.onHurt((damage: number) => {
    healthBarFill.width = (enemy.hp / enemy.maxHP) * 60;
  })

  enemy.onDeath(() => {
    enemy.destroy();
  });

  return enemy;
};