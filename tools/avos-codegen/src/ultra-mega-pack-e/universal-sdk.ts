import { randomUUID } from "node:crypto";

export type SdkLanguage =
  | "typescript"
  | "python"
  | "csharp"
  | "java"
  | "go";

export type SdkProtocol = "rest" | "graphql" | "events";

export interface SdkOperation {
  key: string;
  protocol: SdkProtocol;
  path: string;
  method: string;
  requestType?: string;
  responseType?: string;
}

export interface SdkDefinition {
  key: string;
  systemKey: string;
  version: string;
  languages: SdkLanguage[];
  operations: SdkOperation[];
}

export interface GeneratedSdk {
  id: string;
  definitionKey: string;
  language: SdkLanguage;
  packageName: string;
  version: string;
  operations: number;
  artifactFiles: string[];
  generatedAt: string;
}

export class AvosUniversalSdk {
  generate(definition: SdkDefinition): GeneratedSdk[] {
    return definition.languages.map((language) => {
      const extension = this.extension(language);
      const packageName = this.packageName(definition.systemKey, language);

      return {
        id: randomUUID(),
        definitionKey: definition.key,
        language,
        packageName,
        version: definition.version,
        operations: definition.operations.length,
        artifactFiles: [
          `src/client.${extension}`,
          `src/types.${extension}`,
          `README.md`,
          `package.manifest.json`,
        ],
        generatedAt: new Date().toISOString(),
      };
    });
  }

  private extension(language: SdkLanguage): string {
    switch (language) {
      case "typescript":
        return "ts";
      case "python":
        return "py";
      case "csharp":
        return "cs";
      case "java":
        return "java";
      case "go":
        return "go";
    }
  }

  private packageName(systemKey: string, language: SdkLanguage): string {
    return `avos-${systemKey.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${language}`;
  }
}

export class SdkRegistry {
  private readonly entries = new Map<string, GeneratedSdk>();

  register(sdk: GeneratedSdk): void {
    this.entries.set(`${sdk.definitionKey}:${sdk.language}:${sdk.version}`, {
      ...sdk,
      artifactFiles: [...sdk.artifactFiles],
    });
  }

  list(): GeneratedSdk[] {
    return Array.from(this.entries.values()).map((entry) => ({
      ...entry,
      artifactFiles: [...entry.artifactFiles],
    }));
  }
}
