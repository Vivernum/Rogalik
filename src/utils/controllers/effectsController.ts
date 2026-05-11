import { EffectCallbackResultType, EnemyEffectPayloadType, EnemyUseEffectCallbackType, IPlayerEffectController, PlayerEffectPayloadType } from "../../types/effect";
import { EnemyComp } from "../../types/ememies";
import { EffectsType, IEnemyEffectController } from "../../types/effect";
import { IPlayer } from "../../types/player";

export class EnemyEffectsController implements IEnemyEffectController {
  private effects: Map<EffectsType, EffectCallbackResultType> = new Map();

  public addEffect({ effectCallback, effectType}: EnemyEffectPayloadType, entity: EnemyComp): void {
    if (this.effects.has(effectType)) {
      this.removeEffect({ effectCallback, effectType })
    };
    this.effects.set(effectType, effectCallback(entity));
    this.effects.get(effectType)?.onEnd.then(() => {
      this.removeEffect({ effectCallback, effectType });
    });
  };

  public removeEffect({ effectType }: EnemyEffectPayloadType) {
    if (!this.effects.has(effectType)) return;
    this.effects.get(effectType)?.stop();
    this.effects.delete(effectType);
  }
}

export class PlayerEffectsController implements IPlayerEffectController {
  private effects: Map<EffectsType, EffectCallbackResultType> = new Map();

  public addEffect({ effectCallback, effectType }: PlayerEffectPayloadType, entity: IPlayer): void {
    if (this.effects.has(effectType)) {
      this.removeEffect({ effectCallback, effectType })
    };
    this.effects.set(effectType, effectCallback(entity));
    this.effects.get(effectType)?.onEnd.then(() => {
      this.removeEffect({ effectCallback, effectType });
    });
  };

  public removeEffect({ effectType }: PlayerEffectPayloadType): void {
    this.effects.get(effectType)?.stop();
    this.effects.delete(effectType);
  }
}