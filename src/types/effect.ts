import { EnemyComp } from "./ememies";

export enum EffectsType {
  FIRE,
  COLD,
  LIGHT,
  DARK,
  POISON,
  BLEEDING
};

export type EffectCallbackResultType = {
  stop: () => void,
  onEnd: Promise<void>,
};

export type EnemyUseEffectCallbackType = (entity: EnemyComp) => EffectCallbackResultType

export interface IEffectController {
  addEffect(effectType: EffectsType, callbackFn: EnemyUseEffectCallbackType, entity: EnemyComp): void,
}

