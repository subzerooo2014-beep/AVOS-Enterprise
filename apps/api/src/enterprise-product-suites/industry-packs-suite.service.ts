import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { IndustryPackActivation } from "./enterprise-product-suites.types";

@Injectable()
export class IndustryPacksSuiteService {
  private readonly activations = new Map<string, IndustryPackActivation>();

  activate(
    input: Omit<IndustryPackActivation, "id" | "createdAt" | "updatedAt">,
  ): IndustryPackActivation {
    const now = new Date().toISOString();

    const activation: IndustryPackActivation = {
      ...input,
      id: randomUUID(),
      enabledCapabilities: [...new Set(input.enabledCapabilities)],
      configuration: { ...input.configuration },
      createdAt: now,
      updatedAt: now,
    };

    this.activations.set(activation.id, activation);
    return this.clone(activation);
  }

  updateCapabilities(
    id: string,
    enabledCapabilities: string[],
  ): IndustryPackActivation {
    const activation = this.requireActivation(id);
    activation.enabledCapabilities = [...new Set(enabledCapabilities)];
    activation.updatedAt = new Date().toISOString();
    this.activations.set(id, activation);
    return this.clone(activation);
  }

  dashboard() {
    const activations = Array.from(this.activations.values());

    return {
      activations: activations.length,
      active: activations.filter((item) => item.active).length,
      industries: new Set(activations.map((item) => item.industryKey)).size,
      enabledCapabilities: activations.reduce(
        (sum, item) => sum + item.enabledCapabilities.length,
        0,
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireActivation(id: string): IndustryPackActivation {
    const activation = this.activations.get(id);
    if (!activation) {
      throw new Error(`Industry pack activation not found: ${id}`);
    }
    return activation;
  }

  private clone(activation: IndustryPackActivation): IndustryPackActivation {
    return {
      ...activation,
      enabledCapabilities: [...activation.enabledCapabilities],
      configuration: { ...activation.configuration },
    };
  }
}