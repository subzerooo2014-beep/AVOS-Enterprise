import { Injectable } from "@nestjs/common";

@Injectable()
export class CodeGenerationCapabilityFabricIntegration {
  resolve(requested: string[]) {
    return { requested, resolved: requested, unresolved: [] as string[] };
  }
}
