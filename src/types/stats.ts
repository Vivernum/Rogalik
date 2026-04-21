export type PlayersStatsType = {
  fireDamage: number;
  coldDamage: number;
  darkDamage: number;
  lightDamage: number;
};

type PhysicalDamage = {
  physicalDamage: number;
};

export type AllDamageTypes = Partial<PhysicalDamage & PlayersStatsType>;

export type ResistanceType = {
  physicalResistance: number;
  fireResistance: number;
  coldResistance: number;
  darkResistance: number;
  lightResistance: number;
};
