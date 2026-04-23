import { IResistanceStatsController } from "../../types/controllers";
import { ResistanceType } from "../../types/stats";

class ResistanceStatsController implements IResistanceStatsController{
  private resistanceStats: ResistanceType = {
    armor: 0,
    fireResistance: 0,
    coldResistance: 0,
    darkResistance: 0,
    lightResistance: 0,
  };

  constructor(resistanceStats?: ResistanceType) {
    if (resistanceStats) {
      this.resistanceStats = { ...resistanceStats };
    }
  }

  public addResistance(resistance: Partial<ResistanceType>): void {
    for (const key in resistance) {
      this.resistanceStats[key] += resistance[key];
    }
  }

  public removeResistance(resistance: Partial<ResistanceType>): void {
    for (const key in resistance) {
      this.resistanceStats[key] -= resistance[key];
    }
  }

  public getResistanceStats(): ResistanceType {
    return { ...this.resistanceStats };
  }
}

export default ResistanceStatsController;
