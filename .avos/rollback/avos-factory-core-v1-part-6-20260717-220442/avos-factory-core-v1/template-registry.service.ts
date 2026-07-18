import { Injectable } from "@nestjs/common";
import {
  AvosTemplate
} from "./template.contracts";
import {
  TemplateNotFoundError
} from "./template.errors";

@Injectable()
export class TemplateRegistryService {
  private readonly templates =
    new Map<string, Map<string, AvosTemplate>>();

  register(
    template: AvosTemplate
  ): AvosTemplate {
    const versions =
      this.templates.get(template.id) ??
      new Map<string, AvosTemplate>();

    const stored =
      structuredClone(template);

    versions.set(
      template.version,
      stored
    );

    this.templates.set(
      template.id,
      versions
    );

    return structuredClone(stored);
  }

  get(
    templateId: string,
    version?: string
  ): AvosTemplate {
    const versions =
      this.templates.get(templateId);

    if (!versions || versions.size === 0) {
      throw new TemplateNotFoundError(
        templateId,
        version
      );
    }

    if (version) {
      const template =
        versions.get(version);

      if (!template) {
        throw new TemplateNotFoundError(
          templateId,
          version
        );
      }

      return structuredClone(template);
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
      throw new TemplateNotFoundError(
        templateId
      );
    }

    return structuredClone(latest);
  }

  list(): AvosTemplate[] {
    const result: AvosTemplate[] = [];

    for (
      const versions
      of this.templates.values()
    ) {
      for (
        const template
        of versions.values()
      ) {
        result.push(
          structuredClone(template)
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
    templateId: string
  ): AvosTemplate[] {
    const versions =
      this.templates.get(templateId);

    if (!versions) {
      return [];
    }

    return [...versions.values()]
      .map((template) =>
        structuredClone(template)
      )
      .sort((left, right) =>
        this.compareVersions(
          right.version,
          left.version
        )
      );
  }

  has(
    templateId: string,
    version?: string
  ): boolean {
    const versions =
      this.templates.get(templateId);

    if (!versions) {
      return false;
    }

    return version
      ? versions.has(version)
      : versions.size > 0;
  }

  countTemplates(): number {
    return this.templates.size;
  }

  countVersions(): number {
    let count = 0;

    for (
      const versions
      of this.templates.values()
    ) {
      count += versions.size;
    }

    return count;
  }

  archive(
    templateId: string,
    version?: string
  ): AvosTemplate {
    const template =
      this.get(templateId, version);

    return this.register({
      ...template,
      status: "archived",
      metadata: {
        ...template.metadata,
        updatedAt:
          new Date().toISOString()
      }
    });
  }

  private compareVersions(
    left: string,
    right: string
  ): number {
    const leftParts =
      left.split(".").map(Number);

    const rightParts =
      right.split(".").map(Number);

    const length =
      Math.max(
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
