import { EnemyComp } from "./ememies";
import { IPlayer } from "./player";

export enum EffectsType {
  FIRE,
  COLD,
  LIGHT,
  DARK,
};

export type EffectCallbackResultType = {
  stop: () => void,
  onEnd: Promise<void>,
};

export type EnemyUseEffectCallbackType = (entity: EnemyComp) => EffectCallbackResultType
export type PlayerUseEffectCallbackType = (entity: IPlayer) => EffectCallbackResultType;

export interface IEnemyEffectController {
  addEffect(effectPayload: EnemyEffectPayloadType, entity: EnemyComp): void,
  removeEffect(effectPayload: EnemyEffectPayloadType): void,
}

export interface IPlayerEffectController {
  addEffect(effectPayload: PlayerEffectPayloadType, entity: IPlayer): void,
  removeEffect(effectPayload: PlayerEffectPayloadType): void,
}

export type EnemyEffectPayloadType = {
  effectCallback: EnemyUseEffectCallbackType,
  effectType: EffectsType,
};

export type PlayerEffectPayloadType = {
  effectCallback: PlayerUseEffectCallbackType,
  effectType: EffectsType,
};
