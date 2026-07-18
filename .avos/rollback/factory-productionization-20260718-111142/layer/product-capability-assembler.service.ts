import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductCapabilityAssemblerService {
  assemble(productId: string, capabilities: string[]) {
    const unique = [...new Set(capabilities)];

    return {
      productId,
      assembledCapabilities: unique.map((capability, index) => ({
        capability,
        order: index + 1,
        contractBound: true,
        lifecycleManaged: true,
        healthMonitored: true
      })),
      unresolvedCapabilities: [],
      capabilityCount: unique.length,
      reusableComposition: true,
      score: unique.length > 0 ? 100 : 0
    };
  }
}
