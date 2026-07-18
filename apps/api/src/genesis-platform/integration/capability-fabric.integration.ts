import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityFabricIntegration {
  resolve(requestedCapabilities: string[]): {
    requested: string[];
    resolved: string[];
    unresolved: string[];
  } {
    return {
      requested: requestedCapabilities,
      resolved: [...new Set(requestedCapabilities)],
      unresolved: [],
    };
  }
}
