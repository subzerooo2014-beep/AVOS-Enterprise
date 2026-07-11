export interface CodeGenCapabilityMatchResult {
  compatible: boolean;
  matched: string[];
  missing: string[];
  extra: string[];
  score: number;
}

export class CodeGenCapabilityResolver {
  resolve(
    required:
      readonly string[],
    available:
      readonly string[],
  ): CodeGenCapabilityMatchResult {
    const matched =
      required.filter(
        (capability) =>
          available.includes(
            capability,
          ),
      );

    const missing =
      required.filter(
        (capability) =>
          !available.includes(
            capability,
          ),
      );

    const extra =
      available.filter(
        (capability) =>
          !required.includes(
            capability,
          ),
      );

    return {
      compatible:
        missing.length === 0,
      matched,
      missing,
      extra,
      score:
        required.length === 0
          ? 100
          : Math.round(
              matched.length /
              required.length *
              100,
            ),
    };
  }
}
