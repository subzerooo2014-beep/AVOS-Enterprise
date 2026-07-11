export class CodeGenFeatureFlagEngine {
  isEnabled(
    featureFlags:
      Readonly<
        Record<string, boolean>
      >,
    key: string,
    defaultValue = false,
  ): boolean {
    return featureFlags[key] ??
      defaultValue;
  }

  requireEnabled(
    featureFlags:
      Readonly<
        Record<string, boolean>
      >,
    keys:
      readonly string[],
  ): string[] {
    return keys.filter(
      (key) =>
        !this.isEnabled(
          featureFlags,
          key,
        ),
    );
  }
}
