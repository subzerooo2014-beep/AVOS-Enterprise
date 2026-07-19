import { Injectable } from "@nestjs/common";
import { ServiceContract } from "./platform-production-mega-pack-2.types";
import { ServiceMeshFileStoreService } from "./service-mesh-file-store.service";

@Injectable()
export class ServiceContractRegistryService {
  constructor(
    private readonly store: ServiceMeshFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  register(
    input: Omit<ServiceContract, "id" | "createdAt" | "status">,
  ): ServiceContract {
    if (!input.approvedBy || !input.approvedBy.startsWith("human:")) {
      throw new Error(
        "Service contract activation requires Human Final Authority.",
      );
    }

    const contract: ServiceContract = {
      ...input,
      id: this.id("service-contract"),
      status: "active",
      createdAt: this.now(),
    };

    this.store.writeJson(`contracts/${contract.id}.json`, contract);
    return contract;
  }

  list(): ServiceContract[] {
    return this.store.listJson<ServiceContract>("contracts");
  }

  resolve(
    serviceKey: string,
    version?: string,
  ): ServiceContract | undefined {
    return this.list()
      .filter(
        (contract) =>
          contract.serviceKey === serviceKey &&
          contract.status === "active" &&
          (!version || contract.version === version),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }
}