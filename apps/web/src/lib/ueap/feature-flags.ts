import type { FeatureFlag } from "./types";

export function isFeatureEnabled(
  flags: FeatureFlag[],
  key: string,
  stableSeed = 50,
): boolean {
  const flag = flags.find((entry) => entry.key === key);
  if (!flag || !flag.enabled) return false;
  return stableSeed <= flag.rolloutPercentage;
}
