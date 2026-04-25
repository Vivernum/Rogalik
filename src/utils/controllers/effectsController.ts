import { EffectCallbackResultType, EffectPayloadType, EnemyUseEffectCallbackType } from "../../types/effect";
import { EnemyComp } from "../../types/ememies";
import { EffectsType, IEffectController } from "../../types/effect";

export class EnemyEffectsController implements IEffectController {
  private effects: Map<EffectsType, EffectCallbackResultType> = new Map();

  public addEffect({ effectCallback, effectType}: EffectPayloadType, entity: EnemyComp): void {
    if (this.effects.has(effectType)) {
      this.removeEffect({ effectCallback, effectType })
    };
    this.effects.set(effectType, effectCallback(entity));
    this.effects.get(effectType)?.onEnd.then(() => {
      this.removeEffect({ effectCallback, effectType });
    });
  };

  public removeEffect({ effectType }: EffectPayloadType) {
    this.effects.get(effectType)?.stop();
    this.effects.delete(effectType);
  }
}