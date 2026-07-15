import { Injectable } from "@nestjs/common";
import {
  AVOS_DESIGN_COMPONENTS,
  AVOS_DESIGN_SYSTEM,
  AVOS_DESIGN_TOKENS,
} from "./design-system-foundation.registry";
import { DesignTokenCategory } from "./design-system-foundation.types";

@Injectable()
export class DesignSystemFoundationService {
  getDesignSystem() {
    return {
      ...AVOS_DESIGN_SYSTEM,
      tokens: AVOS_DESIGN_TOKENS.map((token) => ({ ...token })),
      components: AVOS_DESIGN_COMPONENTS.map((component) => ({
        ...component,
        states: [...component.states],
      })),
      governanceRules: [...AVOS_DESIGN_SYSTEM.governanceRules],
    };
  }

  getTokens(category?: DesignTokenCategory) {
    return AVOS_DESIGN_TOKENS
      .filter((token) => !category || token.category === category)
      .map((token) => ({ ...token }));
  }

  getComponents() {
    return AVOS_DESIGN_COMPONENTS.map((component) => ({
      ...component,
      states: [...component.states],
    }));
  }

  validateProductUsage(input: {
    productName: string;
    usedTokens: string[];
    usedComponents: string[];
    accessibilityChecked: boolean;
    responsiveChecked: boolean;
    bilingualChecked: boolean;
  }) {
    const officialTokens = new Set(
      AVOS_DESIGN_TOKENS.map((token) => token.name),
    );
    const officialComponents = new Set(
      AVOS_DESIGN_COMPONENTS.map((component) => component.name),
    );

    const unknownTokens = input.usedTokens.filter(
      (token) => !officialTokens.has(token),
    );
    const unknownComponents = input.usedComponents.filter(
      (component) => !officialComponents.has(component),
    );

    const valid =
      unknownTokens.length === 0 &&
      unknownComponents.length === 0 &&
      input.accessibilityChecked &&
      input.responsiveChecked &&
      input.bilingualChecked;

    return {
      productName: input.productName,
      valid,
      unknownTokens,
      unknownComponents,
      accessibilityChecked: input.accessibilityChecked,
      responsiveChecked: input.responsiveChecked,
      bilingualChecked: input.bilingualChecked,
      checkedAt: new Date().toISOString(),
    };
  }
}