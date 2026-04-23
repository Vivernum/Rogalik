import {
  IEnemyAttackStatsController,
  IPlayersAttackStatsController,
} from "../../types/controllers";
import {
  EnemyAttackStatsType,
  PartialEnemyAttackStatsType,
  PartialPlayersAttackStatsType,
  PlayersAtackStatsType,
} from "../../types/stats";

export class PlayerAttackStatsController implements IPlayersAttackStatsController {
  private damageStats: PlayersAtackStatsType = {
    fireDamage: 0,
    coldDamage: 0,
    darkDamage: 0,
    lightDamage: 0,
  };

  constructor(stats?: PlayersAtackStatsType) {
    if (stats) {
      this.damageStats = { ...stats };
    }
  }

  public addDamage(damage: PartialPlayersAttackStatsType) {
    for (const key in damage) {
      this.damageStats[key] += damage[key];
    }
  }

  public removeDamage(damage: PartialPlayersAttackStatsType) {
    for (const key in damage) {
      this.damageStats[key] -= damage[key];
    }
  }

  public getDamageStats(): PlayersAtackStatsType {
    return { ...this.damageStats };
  }
}

export class EnemyAttackStatsController implements IEnemyAttackStatsController {
  private damageStats: EnemyAttackStatsType = {
    physicalDamage: 0,
    fireDamage: 0,
    coldDamage: 0,
    darkDamage: 0,
    lightDamage: 0,
  };

  constructor(stats?: EnemyAttackStatsType) {
    if (stats) {
      this.damageStats = { ...stats };
    }
  }

  public addDamage(damage: PartialEnemyAttackStatsType) {
    for (const key in damage) {
      this.damageStats[key] += damage[key];
    }
  }

  public removeDamage(damage: PartialEnemyAttackStatsType) {
    for (const key in damage) {
      this.damageStats[key] -= damage[key];
    }
  }

  public getDamageStats() {
    return { ...this.damageStats };
  }
}
