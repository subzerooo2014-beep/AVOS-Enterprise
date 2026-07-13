import { BadRequestException, Injectable } from "@nestjs/common";

type ContractDefinition = {
  id: string;
  name: string;
  version: number;
  requiredFields: string[];
  active: boolean;
  createdAt: string;
};

@Injectable()
export class CoreFlowContractService {
  private readonly contracts = new Map<string, ContractDefinition[]>();

  register(name: string, requiredFields: string[]) {
    const versions = this.contracts.get(name) ?? [];
    for (const contract of versions) contract.active = false;

    const contract: ContractDefinition = {
      id: `contract_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      version: versions.length + 1,
      requiredFields,
      active: true,
      createdAt: new Date().toISOString(),
    };

    versions.push(contract);
    this.contracts.set(name, versions);
    return contract;
  }

  validate(name: string, payload: Record<string, unknown>) {
    const contract = (this.contracts.get(name) ?? []).find(
      (item) => item.active,
    );
    if (!contract) {
      throw new BadRequestException("Active flow contract not found.");
    }

    const missing = contract.requiredFields.filter(
      (field) =>
        payload[field] === undefined ||
        payload[field] === null ||
        payload[field] === "",
    );

    return {
      valid: missing.length === 0,
      contract,
      missing,
      validatedAt: new Date().toISOString(),
    };
  }

  list() {
    return Array.from(this.contracts.values()).flat().reverse();
  }
}
