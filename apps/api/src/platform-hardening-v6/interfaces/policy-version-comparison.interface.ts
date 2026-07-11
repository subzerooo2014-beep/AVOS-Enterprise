export interface PolicyVersionDifference {
  field: string;
  before: unknown;
  after: unknown;
  changed: boolean;
}

export interface PolicyVersionComparison {
  policyId: string;
  fromVersion: number;
  toVersion: number;
  changed: boolean;
  differences: PolicyVersionDifference[];
  comparedAt: string;
}
