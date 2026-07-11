import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";

export interface EnterpriseModuleV2Field {
  name: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "json";
  required: boolean;
  unique?: boolean;
  maxLength?: number;
}

export interface EnterpriseModuleV2Input {
  moduleName: string;
  routeName?: string;
  entityName?: string;
  fields?: EnterpriseModuleV2Field[];
  includeController?: boolean;
  includeService?: boolean;
  includeDtos?: boolean;
  includeTests?: boolean;
  includeManifest?: boolean;
  metadata?: Record<
    string,
    CodeGenJsonValue
  >;
}
