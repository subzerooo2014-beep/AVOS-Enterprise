import { Injectable } from "@nestjs/common";
import { GenesisBlueprint } from "../types/genesis-platform.types";

@Injectable()
export class GenesisBlueprintRegistry {
  private readonly blueprints = new Map<string, GenesisBlueprint>();

  register(blueprint: GenesisBlueprint): GenesisBlueprint {
    this.blueprints.set(blueprint.id, structuredClone(blueprint));
    return structuredClone(blueprint);
  }

  get(id: string): GenesisBlueprint | undefined {
    const blueprint = this.blueprints.get(id);
    return blueprint ? structuredClone(blueprint) : undefined;
  }

  list(): GenesisBlueprint[] {
    return [...this.blueprints.values()].map((item) => structuredClone(item));
  }

  count(): number {
    return this.blueprints.size;
  }
}
