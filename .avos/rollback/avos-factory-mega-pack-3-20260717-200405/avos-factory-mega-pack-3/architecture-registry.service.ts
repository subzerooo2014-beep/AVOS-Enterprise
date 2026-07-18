import { Injectable } from "@nestjs/common";
import { EnterpriseArchitectureModel } from "./architecture-engine.contracts";

@Injectable()
export class ArchitectureRegistryService {
  private readonly architectures = new Map<string, EnterpriseArchitectureModel>();

  save(model: EnterpriseArchitectureModel): EnterpriseArchitectureModel {
    this.architectures.set(model.id, structuredClone(model));
    return structuredClone(model);
  }

  findById(id: string): EnterpriseArchitectureModel | undefined {
    const model = this.architectures.get(id);
    return model ? structuredClone(model) : undefined;
  }

  list(): EnterpriseArchitectureModel[] {
    return [...this.architectures.values()].map((item) => structuredClone(item));
  }

  count(): number {
    return this.architectures.size;
  }
}
