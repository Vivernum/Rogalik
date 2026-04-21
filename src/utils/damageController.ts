import { AllDamageTypes, ResistanceType } from "../types/stats";
import { damageToResistance } from "./keyMaps";

export function calculateReceivedDamage(
  damage: AllDamageTypes,
  resistance: ResistanceType,
): number {
  let result = 0;
  for (const key in damage) {
    const resistanceKey = damageToResistance.get(key);
    if (resistanceKey !== undefined) {
      result += damage[key] * (1 - resistance[resistanceKey]);
    }
  }

  return result;
}
