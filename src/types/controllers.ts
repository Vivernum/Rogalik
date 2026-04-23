import { EnemyAttackStatsType, PartialEnemyAttackStatsType, PartialPlayersAttackStatsType, PlayersAtackStatsType, ResistanceType } from "./stats";

export interface IPlayersAttackStatsController {
  addDamage: (damage: PartialPlayersAttackStatsType) => void;
  removeDamage: (damage: PartialPlayersAttackStatsType) => void;
  getDamageStats: () => PlayersAtackStatsType;
};

export interface IEnemyAttackStatsController {
  addDamage: (damage: PartialEnemyAttackStatsType) => void;
  removeDamage: (damage: PartialEnemyAttackStatsType) => void;
  getDamageStats: () => EnemyAttackStatsType;
}

export interface IResistanceStatsController {
  addResistance: (resistance: Partial<ResistanceType>) => void;
  removeResistance: (resistance: Partial<ResistanceType>) => void;
  getResistanceStats: () => ResistanceType;
}