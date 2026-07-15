import { Injectable } from "@nestjs/common";
import { AVOS_CORE_FOUNDATION } from "./brand-foundation.registry";
import { FoundationLayer } from "./brand-foundation.types";

@Injectable()
export class BrandFoundationService {
  getFoundation() {
    return structuredClone(AVOS_CORE_FOUNDATION);
  }

  getMandatoryOrder(): FoundationLayer[] {
    return [...AVOS_CORE_FOUNDATION.mandatoryOrder];
  }

  validateProductFoundation(input: {
    productName: string;
    completedLayers: FoundationLayer[];
  }) {
    const completed = new Set(input.completedLayers);
    const missingLayers = AVOS_CORE_FOUNDATION.mandatoryOrder.filter(
      (layer) => !completed.has(layer),
    );

    return {
      productName: input.productName,
      valid: missingLayers.length === 0,
      missingLayers,
      requiredOrder: [...AVOS_CORE_FOUNDATION.mandatoryOrder],
      checkedAt: new Date().toISOString(),
    };
  }

  validateArchitectureEntry(input: {
    productName: string;
    requestedEntryLayer: FoundationLayer;
  }) {
    const index = AVOS_CORE_FOUNDATION.mandatoryOrder.indexOf(
      input.requestedEntryLayer,
    );

    const prerequisiteLayers =
      index <= 0
        ? []
        : AVOS_CORE_FOUNDATION.mandatoryOrder.slice(0, index);

    return {
      productName: input.productName,
      requestedEntryLayer: input.requestedEntryLayer,
      prerequisiteLayers,
      allowedToProceed: prerequisiteLayers.length === 0,
      rule:
        "Products must proceed through the official foundation sequence without skipping layers.",
    };
  }
}