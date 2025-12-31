import { KAPLAYCtxT, GameObj, PosComp, LevelComp } from "kaplay";

export function createEnemy(k: KAPLAYCtxT, l: GameObj<PosComp | LevelComp>, pos: number[]) {
  k.loadSprite('enemy', 'sprites/Entities/dio.png')

  const enemy = k.add([
    k.sprite('enemy'),
    k.pos(pos[0], pos[1]),
    k.health(100),
    k.opacity(1),
    k.sentry({include: 'player'}, {
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
        this.onObjectsSpotted(obj => {
          const playerSeen = obj.some(o => o.is('player'));
          if(playerSeen) {
            enemy.action = 'pursuit';
          }
        });
      },
    },
  ]);

  enemy.onHurt((damage: number) => {
    enemy.opacity -= damage * 0.01;
  })

  enemy.onDeath(() => {
    enemy.destroy();
  });

  return enemy;
};