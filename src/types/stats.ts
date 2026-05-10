export type PlayersAtackStatsType = {
  fireDamage: number;
  coldDamage: number;
  darkDamage: number;
  lightDamage: number;
};

export type PartialPlayersAttackStatsType = Partial<PlayersAtackStatsType>;

export type PhysicalAttackStatType = {
  physicalDamage: number;
};

export type AllAttackStatsType = PlayersAtackStatsType & PhysicalAttackStatType;

export type PartialAllAttackStatsType = Partial<AllAttackStatsType>;

export type EnemyAttackStatsType = PlayersAtackStatsType & PhysicalAttackStatType;

export type PartialEnemyAttackStatsType = Partial<EnemyAttackStatsType>;

export type ResistanceType = {
  armor: number;
  fireResistance: number;
  coldResistance: number;
  darkResistance: number;
  lightResistance: number;
  durability: number;
};
