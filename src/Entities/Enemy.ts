import { KAPLAYCtxT, GameObj, PosComp, LevelComp } from "kaplay";

export function createEnemy(k: KAPLAYCtxT, l: GameObj<PosComp | LevelComp>, pos: number[]) {
  k.loadSprite('enemy', 'sprites/Entities/dio.png');
  k.loadSprite('sword', 'sprites/Weapons/sword.png');

  const enemy = k.add([
    k.sprite('enemy'),
    k.pos(pos[0], pos[1]),
    k.anchor(k.vec2(1, 0)),
    k.health(100, 100),
    k.opacity(1),
    k.sentry({include: 'player',}, {
      lineOfSight: true,
      raycastExclude: ['enemy'],
      direction: k.vec2(-1, 1),
      fieldOfView: 90,
    }),
    k.area(),
    k.body(),
    'enemy',
    {
      action: 'patrol',

      add() {
        this.onObjectsSpotted((obj: GameObj) => {
          const playerSeen = obj.some(o => o.is('player'));
          if(playerSeen) {
            enemy.action = 'pursuit';
          }
        });
      },
    },
  ]);

  const healthBar = enemy.add([
    k.rect(60, 10, {
      radius: 10,
    }),
    k.color(k.RED),
    k.pos(k.vec2(-55, -40)),
    k.outline(2, k.BLACK),
    k.opacity(0.5),
  ]);

  enemy.add([
    k.sprite('sword'),
    k.anchor(k.vec2(0, 0)),
  ])

  enemy.onHurt((damage: number) => {
    enemy.opacity -= damage * 0.01;
    healthBar.width = (enemy.hp / enemy.maxHP) * 60;
  })

  enemy.onDeath(() => {
    enemy.destroy();
  });

  return enemy;
};