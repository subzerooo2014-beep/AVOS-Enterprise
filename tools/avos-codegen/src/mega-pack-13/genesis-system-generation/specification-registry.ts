import { randomUUID } from "node:crypto";
import {
  GenesisSystemSpecification,
  GenesisSystemStatus,
} from "./contracts";

export class GenesisSystemSpecificationRegistry {
  private readonly specifications =
    new Map<string, GenesisSystemSpecification>();

  create(
    input: Omit<
      GenesisSystemSpecification,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): GenesisSystemSpecification {
    const now = new Date().toISOString();

    const specification: GenesisSystemSpecification = {
      ...structuredClone(input),
      id: randomUUID(),
      status: GenesisSystemStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    };

    this.specifications.set(
      specification.id,
      structuredClone(specification),
    );

    return structuredClone(specification);
  }

  get(systemId: string): GenesisSystemSpecification {
    const specification =
      this.specifications.get(systemId);

    if (!specification) {
      throw new Error(
        `Genesis system specification not found: ${systemId}`,
      );
    }

    return structuredClone(specification);
  }

  save(
    specification: GenesisSystemSpecification,
  ): GenesisSystemSpecification {
    const updated: GenesisSystemSpecification = {
      ...structuredClone(specification),
      updatedAt: new Date().toISOString(),
    };

    this.specifications.set(
      updated.id,
      structuredClone(updated),
    );

    return structuredClone(updated);
  }

  transition(
    systemId: string,
    status: GenesisSystemStatus,
  ): GenesisSystemSpecification {
    const specification = this.get(systemId);

    this.assertTransition(
      specification.status,
      status,
    );

    specification.status = status;

    return this.save(specification);
  }

  list(): GenesisSystemSpecification[] {
    return Array.from(
      this.specifications.values(),
    )
      .map((item) => structuredClone(item))
      .sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      );
  }

  private assertTransition(
    from: GenesisSystemStatus,
    to: GenesisSystemStatus,
  ): void {
    const allowed: Record<
      GenesisSystemStatus,
      readonly GenesisSystemStatus[]
    > = {
      [GenesisSystemStatus.DRAFT]: [
        GenesisSystemStatus.VALIDATING,
        GenesisSystemStatus.FAILED,
      ],
      [GenesisSystemStatus.VALIDATING]: [
        GenesisSystemStatus.PLANNED,
        GenesisSystemStatus.FAILED,
      ],
      [GenesisSystemStatus.PLANNED]: [
        GenesisSystemStatus.GENERATING,
        GenesisSystemStatus.FAILED,
      ],
      [GenesisSystemStatus.GENERATING]: [
        GenesisSystemStatus.VERIFYING,
        GenesisSystemStatus.FAILED,
        GenesisSystemStatus.ROLLED_BACK,
      ],
      [GenesisSystemStatus.VERIFYING]: [
        GenesisSystemStatus.COMPLETED,
        GenesisSystemStatus.FAILED,
        GenesisSystemStatus.ROLLED_BACK,
      ],
      [GenesisSystemStatus.COMPLETED]: [],
      [GenesisSystemStatus.FAILED]: [
        GenesisSystemStatus.ROLLED_BACK,
      ],
      [GenesisSystemStatus.ROLLED_BACK]: [],
    };

    if (!allowed[from].includes(to)) {
      throw new Error(
        `Invalid Genesis transition: ${from} -> ${to}`,
      );
    }
  }
}
