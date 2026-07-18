import { Injectable } from "@nestjs/common";
import {
  CodeGenerationProvider
} from "./code-generation.contracts";
import {
  GenerationProviderNotFoundError,
  GenerationTargetNotSupportedError
} from "./code-generation.errors";

@Injectable()
export class CodeGenerationProviderRegistryService {
  private readonly providers =
    new Map<string, CodeGenerationProvider>();

  register(
    provider: CodeGenerationProvider
  ): CodeGenerationProvider {
    if (
      !provider.id ||
      provider.id.trim().length === 0
    ) {
      throw new Error(
        "Generation provider id is required."
      );
    }

    if (
      this.providers.has(provider.id)
    ) {
      throw new Error(
        `Generation provider "${provider.id}" is already registered.`
      );
    }

    this.providers.set(
      provider.id,
      provider
    );

    return provider;
  }

  replace(
    provider: CodeGenerationProvider
  ): CodeGenerationProvider {
    this.providers.set(
      provider.id,
      provider
    );

    return provider;
  }

  resolve(
    providerId: string,
    target?: string
  ): CodeGenerationProvider {
    const provider =
      this.providers.get(providerId);

    if (!provider) {
      throw new GenerationProviderNotFoundError(
        providerId
      );
    }

    if (
      target &&
      !provider.supports(target)
    ) {
      throw new GenerationTargetNotSupportedError(
        providerId,
        target
      );
    }

    return provider;
  }

  findForTarget(
    target: string
  ): CodeGenerationProvider[] {
    return [...this.providers.values()]
      .filter(
        (provider) =>
          provider.supports(target)
      )
      .sort(
        (left, right) =>
          left.id.localeCompare(right.id)
      );
  }

  list(): Array<{
    id: string;
    name: string;
    version: string;
    supportedTargets: string[];
  }> {
    return [...this.providers.values()]
      .map((provider) => ({
        id: provider.id,
        name: provider.name,
        version: provider.version,
        supportedTargets: [
          ...provider.supportedTargets
        ]
      }))
      .sort(
        (left, right) =>
          left.id.localeCompare(right.id)
      );
  }

  has(providerId: string): boolean {
    return this.providers.has(providerId);
  }

  count(): number {
    return this.providers.size;
  }
}
