import { KAPLAYCtxT, GameObj, PosComp, LevelComp } from "kaplay";

export function createEnemy(k: KAPLAYCtxT, l: GameObj<PosComp | LevelComp>, pos: number[]) {
  k.loadSprite('enemy', 'sprites/Entities/dio.png');
  k.loadSprite('sword', 'sprites/Weapons/sword.png');

  const enemy = k.add([
    k.sprite('enemy'),
    k.pos(pos[0], pos[1]),
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
      action: 'patrol',
      speed: 150,
      sightRange: 300,
      attackCooldown: 1,
      lastAttackTime: 0,
      attackDamage: 20,
      prey: null,
      returned: false,

      add() {
        this.onObjectsSpotted((objects: GameObj[]) => {
          const player = objects.find((o: GameObj) => o.is('player'));
          if(player) {
            this.prey = player;
            this.action = 'pursuit';
          }
        });


      },

      update() {
        if(this.prey) {
          if(enemy.pos.x !== pos[0] && enemy.pos.y !== pos[1]) this.returned = false;
          else this.returned = true;
          if(!this.hasLineOfSight(this.prey) && !this.returned) {
            this.action = 'return';
            // this.returnBehavior();
          } else if (!this.hasLineOfSight(this.prey) && this.returned) {
            this.action = 'patrol';
          }
          // console.log(enemy.hasLineOfSight(this.prey));

          switch(this.action) {
            case 'patrol':
              // this.prey = null;
              this.patrolBehavior();
              break;
            case 'pursuit':
              this.pursuitBehavior(this.prey);
              break;
            case 'return':
              this.returnBehavior();
              break;
          }
        };
      },

      patrolBehavior() {

      },

      pursuitBehavior(player: GameObj) {
        this.moveTo(player.pos, this.speed);
        // console.log('pursuit');
      },
// нужно будет добавить такие варианты как returning и тд, чтобы оптимизировать операции здесь
      returnBehavior() {
        this.moveTo(pos[0], pos[1], this.speed);
        // console.log('return');
      },
    },
  ]);

  const healthBar = enemy.add([
    k.rect(60, 10, {
      radius: 10,
      fill: false,
    }),
    k.pos(k.vec2(-55, -40)),
    k.outline(3, k.BLACK),
  ]);

  const healthBarFill = enemy.add([
    k.rect(60, 10, {
      radius: 10,
    }),
    k.pos(k.vec2(-55, -40)),
    k.opacity(0.5),
    k.color(k.RED),
  ]);

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