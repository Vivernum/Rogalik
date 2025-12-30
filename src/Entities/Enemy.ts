import { KAPLAYCtxT, GameObj, PosComp, LevelComp } from "kaplay";

export function createEnemy(k: KAPLAYCtxT, l: GameObj<PosComp | LevelComp>) {
  k.loadSprite('enemy', 'sprites/Entities/dio.png')

  const enemy = k.add([
    k.sprite('enemy'),
    k.pos(400, 400),
    k.sentry({include: 'player'}, {
      lineOfSight: true,
      raycastExclude: ['enemy'],
      direction: k.vec2(0, 1),
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
            console.log('pursuit');
          }
        })
      },
    }
  ]);

  return enemy;
};