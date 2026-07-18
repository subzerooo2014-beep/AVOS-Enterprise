import { BadRequestException, Injectable } from "@nestjs/common";
import { GeneratorPlugin } from "../avos-factory-mega-pack-8/generator-sdk.contracts";
import { GeneratorExecutionRequest } from "./generator-runtime.contracts";

export interface RuntimeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

@Injectable()
export class RuntimeValidationService {
  validateRequest(
    request: GeneratorExecutionRequest
  ): RuntimeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!request) {
      errors.push("Execution request is required.");

      return {
        valid: false,
        errors,
        warnings
      };
    }

    if (
      typeof request.pluginId !== "string" ||
      request.pluginId.trim().length === 0
    ) {
      errors.push("pluginId is required.");
    }

    if (
      typeof request.target !== "string" ||
      request.target.trim().length === 0
    ) {
      errors.push("target is required.");
    }

    if (request.input === undefined) {
      errors.push("input is required.");
    }

    if (
      request.metadata !== undefined &&
      (
        typeof request.metadata !== "object" ||
        request.metadata === null ||
        Array.isArray(request.metadata)
      )
    ) {
      errors.push("metadata must be an object.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  validatePlugin(
    plugin: GeneratorPlugin,
    request: GeneratorExecutionRequest
  ): RuntimeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!plugin.id) {
      errors.push("Plugin id is missing.");
    }

    if (!plugin.name) {
      errors.push("Plugin name is missing.");
    }

    if (!plugin.version) {
      errors.push("Plugin version is missing.");
    }

    if (!plugin.apiVersion) {
      errors.push("Plugin API version is missing.");
    }

    if (!Array.isArray(plugin.supportedTargets)) {
      errors.push("Plugin supportedTargets must be an array.");
    } else if (!plugin.supportedTargets.includes(request.target)) {
      errors.push(
        `Target "${request.target}" is not supported by plugin "${plugin.id}".`
      );
    }

    if (typeof plugin.generate !== "function") {
      errors.push("Plugin generate function is missing.");
    }

    if (typeof plugin.initialize !== "function") {
      errors.push("Plugin initialize function is missing.");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  assertValid(
    requestResult: RuntimeValidationResult,
    pluginResult?: RuntimeValidationResult
  ): void {
    const errors = [
      ...requestResult.errors,
      ...(pluginResult?.errors ?? [])
    ];

    if (errors.length > 0) {
      throw new BadRequestException({
        message: "Generator runtime validation failed.",
        errors
      });
    }
  }
}
