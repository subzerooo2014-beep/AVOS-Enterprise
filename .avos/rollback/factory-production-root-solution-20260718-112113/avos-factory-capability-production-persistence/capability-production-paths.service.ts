import { Injectable } from "@nestjs/common";
import { join, resolve } from "node:path";

@Injectable()
export class CapabilityProductionPathsService {
  private readonly apiRoot = resolve(process.cwd());
  private readonly registryRoot = join(
    this.apiRoot,
    ".avos",
    "factory",
    "capability-production"
  );
  private readonly generatedRoot = join(
    this.apiRoot,
    ".avos",
    "generated-capabilities"
  );

  getRegistryRoot(): string {
    return this.registryRoot;
  }

  getGeneratedRoot(): string {
    return this.generatedRoot;
  }

  workspace(slug: string, version: string): string {
    return join(this.generatedRoot, `${slug}-${version}`);
  }
}
