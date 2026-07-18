import { Injectable } from "@nestjs/common";
import { AvosBlueprint } from "./blueprint.contracts";
import { BlueprintNotFoundError } from "./blueprint.errors";

@Injectable()
export class BlueprintRegistryService {
  private readonly blueprints =
    new Map<string, Map<string, AvosBlueprint>>();

  register(
    blueprint: AvosBlueprint
  ): AvosBlueprint {
    const versions =
      this.blueprints.get(blueprint.id) ??
      new Map<string, AvosBlueprint>();

    const stored =
      this.cloneBlueprint(blueprint);

    versions.set(
      blueprint.version,
      stored
    );

    this.blueprints.set(
      blueprint.id,
      versions
    );

    return this.cloneBlueprint(stored);
  }

  get(
    blueprintId: string,
    version?: string
  ): AvosBlueprint {
    const versions =
      this.blueprints.get(blueprintId);

    if (!versions || versions.size === 0) {
      throw new BlueprintNotFoundError(
        blueprintId,
        version
      );
    }

    if (version) {
      const blueprint =
        versions.get(version);

      if (!blueprint) {
        throw new BlueprintNotFoundError(
          blueprintId,
          version
        );
      }

      return this.cloneBlueprint(blueprint);
    }

    const latest =
      [...versions.values()]
        .sort((left, right) =>
          this.compareVersions(
            right.version,
            left.version
          )
        )[0];

    if (!latest) {
      throw new BlueprintNotFoundError(
        blueprintId
      );
    }

    return this.cloneBlueprint(latest);
  }

  has(
    blueprintId: string,
    version?: string
  ): boolean {
    const versions =
      this.blueprints.get(blueprintId);

    if (!versions) {
      return false;
    }

    return version
      ? versions.has(version)
      : versions.size > 0;
  }

  list(): AvosBlueprint[] {
    const result: AvosBlueprint[] = [];

    for (
      const versions
      of this.blueprints.values()
    ) {
      for (
        const blueprint
        of versions.values()
      ) {
        result.push(
          this.cloneBlueprint(blueprint)
        );
      }
    }

    return result.sort(
      (left, right) =>
        left.id.localeCompare(right.id) ||
        this.compareVersions(
          right.version,
          left.version
        )
    );
  }

  listVersions(
    blueprintId: string
  ): AvosBlueprint[] {
    const versions =
      this.blueprints.get(blueprintId);

    if (!versions) {
      return [];
    }

    return [...versions.values()]
      .map((blueprint) =>
        this.cloneBlueprint(blueprint)
      )
      .sort((left, right) =>
        this.compareVersions(
          right.version,
          left.version
        )
      );
  }

  archive(
    blueprintId: string,
    version?: string
  ): AvosBlueprint {
    const blueprint =
      this.get(blueprintId, version);

    const archived: AvosBlueprint = {
      ...blueprint,
      status: "archived",
      metadata: {
        ...blueprint.metadata,
        updatedAt:
          new Date().toISOString()
      }
    };

    return this.register(archived);
  }

  countBlueprints(): number {
    return this.blueprints.size;
  }

  countVersions(): number {
    let count = 0;

    for (
      const versions
      of this.blueprints.values()
    ) {
      count += versions.size;
    }

    return count;
  }

  private cloneBlueprint(
    blueprint: AvosBlueprint
  ): AvosBlueprint {
    return structuredClone(blueprint);
  }

  private compareVersions(
    left: string,
    right: string
  ): number {
    const leftParts =
      left.split(".").map(Number);

    const rightParts =
      right.split(".").map(Number);

    const length = Math.max(
      leftParts.length,
      rightParts.length
    );

    for (
      let index = 0;
      index < length;
      index += 1
    ) {
      const difference =
        (leftParts[index] ?? 0) -
        (rightParts[index] ?? 0);

      if (difference !== 0) {
        return difference;
      }
    }

    return left.localeCompare(right);
  }
}
