import { Injectable } from "@nestjs/common";
import { GeneratorPlugin } from "./generator-sdk.contracts";

@Injectable()
export class AvosFoundationGeneratorPlugin implements GeneratorPlugin {
  readonly id = "avos.foundation-generator";
  readonly name = "AVOS Foundation Generator";
  readonly version = "1.0.0";
  readonly apiVersion = "1.0";
  readonly supportedTargets = [
    "nestjs-module",
    "nestjs-controller",
    "nestjs-service",
    "typescript"
  ];

  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  async generate(input: unknown): Promise<unknown> {
    if (!this.initialized) {
      throw new Error(
        `Generator plugin "${this.id}" has not been initialized.`
      );
    }

    return {
      success: true,
      pluginId: this.id,
      pluginVersion: this.version,
      generatedAt: new Date().toISOString(),
      input
    };
  }
}
