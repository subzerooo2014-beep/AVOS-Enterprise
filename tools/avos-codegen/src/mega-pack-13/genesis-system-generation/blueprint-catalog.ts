import {
  GenesisBlueprintDescriptor,
} from "./contracts";

export interface GenesisBlueprintCatalog {
  resolve(
    key: string,
    versionRange?: string,
  ): GenesisBlueprintDescriptor | undefined;

  list(): GenesisBlueprintDescriptor[];
}

export class InMemoryGenesisBlueprintCatalog
  implements GenesisBlueprintCatalog {
  private readonly blueprints =
    new Map<string, GenesisBlueprintDescriptor[]>();

  constructor(
    initial:
      readonly GenesisBlueprintDescriptor[] = [],
  ) {
    for (const blueprint of initial) {
      this.register(blueprint);
    }
  }

  register(
    blueprint: GenesisBlueprintDescriptor,
  ): GenesisBlueprintDescriptor {
    const versions =
      this.blueprints.get(blueprint.key) ?? [];

    const duplicate = versions.some(
      (item) => item.version === blueprint.version,
    );

    if (duplicate) {
      throw new Error(
        `Blueprint version already registered: ${blueprint.key}@${blueprint.version}`,
      );
    }

    versions.push(structuredClone(blueprint));
    versions.sort((left, right) =>
      this.compareVersions(
        right.version,
        left.version,
      ),
    );

    this.blueprints.set(
      blueprint.key,
      versions,
    );

    return structuredClone(blueprint);
  }

  resolve(
    key: string,
    versionRange?: string,
  ): GenesisBlueprintDescriptor | undefined {
    const versions =
      this.blueprints.get(key) ?? [];

    const selected =
      versions.find((blueprint) =>
        this.satisfies(
          blueprint.version,
          versionRange,
        ),
      );

    return selected
      ? structuredClone(selected)
      : undefined;
  }

  list(): GenesisBlueprintDescriptor[] {
    return Array.from(
      this.blueprints.values(),
    )
      .flat()
      .map((item) => structuredClone(item));
  }

  private satisfies(
    version: string,
    range?: string,
  ): boolean {
    if (!range || range === "*") {
      return true;
    }

    if (range.startsWith("^")) {
      const expected =
        this.parseVersion(range.slice(1));
      const actual =
        this.parseVersion(version);

      return Boolean(
        expected &&
        actual &&
        actual.major === expected.major &&
        this.compareVersionObjects(
          actual,
          expected,
        ) >= 0,
      );
    }

    if (range.startsWith(">=")) {
      const expected =
        this.parseVersion(range.slice(2));
      const actual =
        this.parseVersion(version);

      return Boolean(
        expected &&
        actual &&
        this.compareVersionObjects(
          actual,
          expected,
        ) >= 0,
      );
    }

    return version === range;
  }

  private compareVersions(
    left: string,
    right: string,
  ): number {
    const leftVersion =
      this.parseVersion(left);
    const rightVersion =
      this.parseVersion(right);

    if (!leftVersion || !rightVersion) {
      return left.localeCompare(right);
    }

    return this.compareVersionObjects(
      leftVersion,
      rightVersion,
    );
  }

  private compareVersionObjects(
    left: {
      major: number;
      minor: number;
      patch: number;
    },
    right: {
      major: number;
      minor: number;
      patch: number;
    },
  ): number {
    if (left.major !== right.major) {
      return left.major - right.major;
    }

    if (left.minor !== right.minor) {
      return left.minor - right.minor;
    }

    return left.patch - right.patch;
  }

  private parseVersion(
    value: string,
  ):
    | {
        major: number;
        minor: number;
        patch: number;
      }
    | undefined {
    const match =
      value.match(
        /^(\d+)\.(\d+)\.(\d+)/,
      );

    if (!match) {
      return undefined;
    }

    return {
      major: Number(match[1]),
      minor: Number(match[2]),
      patch: Number(match[3]),
    };
  }
}
