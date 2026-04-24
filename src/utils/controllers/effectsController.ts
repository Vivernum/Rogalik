import { EffectCallbackResultType, EnemyUseEffectCallbackType } from "../../types/effect";
import { EnemyComp } from "../../types/ememies";
import { EffectsType, IEffectController } from "../../types/effect";

export class EffectsController implements IEffectController {
  private effects: Map<EffectsType, EffectCallbackResultType> = new Map();

  public addEffect(effectType: EffectsType, callbackFn: EnemyUseEffectCallbackType, entity: EnemyComp): void {
    if (this.effects.has(effectType)) {
      this.effects.get(effectType)?.stop();
      this.effects.delete(effectType);
    };
    this.effects.set(effectType, callbackFn(entity));
    this.effects.get(effectType)?.onEnd.then(() => {
      this.effects.get(effectType)?.stop();
      this.effects.delete(effectType);
    })
  };
}