export type ReleaseBump = "major" | "minor" | "patch";

export class SemanticVersionManager {
  next(currentVersion: string, bump: ReleaseBump): string {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(currentVersion);

    if (!match) {
      throw new Error(`Invalid semantic version: ${currentVersion}`);
    }

    const major = Number(match[1]);
    const minor = Number(match[2]);
    const patch = Number(match[3]);

    if (bump === "major") {
      return `${major + 1}.0.0`;
    }

    if (bump === "minor") {
      return `${major}.${minor + 1}.0`;
    }

    return `${major}.${minor}.${patch + 1}`;
  }
}
