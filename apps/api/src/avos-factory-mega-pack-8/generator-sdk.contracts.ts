export interface GeneratorPlugin {
  id: string;
  name: string;
  version: string;
  apiVersion: string;
  supportedTargets: string[];
  initialize(): Promise<void>;
  generate(input: unknown): Promise<unknown>;
}

export interface PluginCompatibilityResult {
  compatible: boolean;
  reasons: string[];
}
