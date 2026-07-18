import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductDataContractEngineService {
  create(productId: string, capabilities: string[]) {
    return {
      productId,
      contracts: capabilities.map((capability) => ({
        capability,
        schemaVersion: "1.0.0",
        inputContract: true,
        outputContract: true,
        eventContract: true,
        provenanceRequired: true
      })),
      metadataLayerConnected: true,
      dataProvenanceProtected: true,
      score: 100
    };
  }
}
