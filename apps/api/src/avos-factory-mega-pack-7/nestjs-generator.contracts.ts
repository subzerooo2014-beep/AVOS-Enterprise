export interface NestJsFieldBlueprint {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object";
  required?: boolean;
}

export interface NestJsEndpointBlueprint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  operationName: string;
}

export interface NestJsModuleBlueprint {
  moduleName: string;
  routePrefix: string;
  description?: string;
  fields?: NestJsFieldBlueprint[];
  endpoints?: NestJsEndpointBlueprint[];
  includeDto?: boolean;
  includeController?: boolean;
  includeService?: boolean;
}

export interface NestJsGeneratedFile {
  path: string;
  kind: "module" | "controller" | "service" | "dto" | "index";
  content: string;
}

export interface NestJsGenerationResult {
  id: string;
  generator: "AVOS NestJS Generator";
  version: "1.0.0";
  blueprint: NestJsModuleBlueprint;
  files: NestJsGeneratedFile[];
  qualityChecks: {
    validModuleName: boolean;
    validRoutePrefix: boolean;
    hasModule: boolean;
    hasService: boolean;
    hasController: boolean;
    dtoIncluded: boolean;
    deterministic: boolean;
  };
  humanApprovalRequired: true;
  generatedAt: string;
}

export interface NestJsGeneratorStatus {
  system: "AVOS Factory";
  megaPack: 7;
  component: "NestJS Generator";
  status: "healthy";
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  supportedArtifacts: string[];
}
