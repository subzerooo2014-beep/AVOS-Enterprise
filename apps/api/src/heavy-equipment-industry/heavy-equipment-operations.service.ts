import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { HeavyEquipmentAssetsService } from "./heavy-equipment-assets.service";
import {
  EquipmentDeployment,
  EquipmentInspection,
  EquipmentListing,
  EquipmentRentalContract,
  EquipmentWorkOrder,
} from "./heavy-equipment-industry.types";

@Injectable()
export class HeavyEquipmentOperationsService {
  private readonly deployments = new Map<string, EquipmentDeployment>();
  private readonly inspections = new Map<string, EquipmentInspection>();
  private readonly workOrders = new Map<string, EquipmentWorkOrder>();
  private readonly rentals = new Map<string, EquipmentRentalContract>();
  private readonly listings = new Map<string, EquipmentListing>();

  constructor(private readonly assets: HeavyEquipmentAssetsService) {}

  createDeployment(
    input: Omit<
      EquipmentDeployment,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): EquipmentDeployment {
    this.assets.requireEquipment(input.equipmentId);
    this.assets.requireSite(input.siteId);

    if (new Date(input.plannedEndAt) <= new Date(input.plannedStartAt)) {
      throw new Error("Deployment end date must be after start date");
    }

    const now = new Date().toISOString();

    const deployment: EquipmentDeployment = {
      ...input,
      id: randomUUID(),
      status: "PLANNED",
      createdAt: now,
      updatedAt: now,
    };

    this.deployments.set(deployment.id, deployment);
    return { ...deployment };
  }

  updateDeploymentStatus(
    id: string,
    status: EquipmentDeployment["status"],
  ): EquipmentDeployment {
    const deployment = this.requireDeployment(id);
    const now = new Date().toISOString();

    deployment.status = status;
    deployment.updatedAt = now;

    if (status === "ACTIVE" && !deployment.actualStartAt) {
      deployment.actualStartAt = now;
      this.assets.assignSite(deployment.equipmentId, deployment.siteId);
      this.assets.updateLifecycleStatus(deployment.equipmentId, "DEPLOYED");
    }

    if (status === "COMPLETED" && !deployment.actualEndAt) {
      deployment.actualEndAt = now;
      this.assets.updateLifecycleStatus(deployment.equipmentId, "AVAILABLE");
    }

    this.deployments.set(id, deployment);
    return { ...deployment };
  }

  createInspection(
    input: Omit<EquipmentInspection, "id" | "createdAt">,
  ): EquipmentInspection {
    this.assets.requireEquipment(input.equipmentId);

    if (input.checklist.length === 0) {
      throw new Error("Inspection checklist cannot be empty");
    }

    const inspection: EquipmentInspection = {
      ...input,
      id: randomUUID(),
      checklist: input.checklist.map((item) => ({ ...item })),
      defects: [...input.defects],
      createdAt: new Date().toISOString(),
    };

    this.inspections.set(inspection.id, inspection);

    if (inspection.result === "FAIL") {
      this.assets.updateLifecycleStatus(
        inspection.equipmentId,
        "OUT_OF_SERVICE",
      );
    }

    return this.cloneInspection(inspection);
  }

  createWorkOrder(
    input: Omit<
      EquipmentWorkOrder,
      "id" | "status" | "openedAt" | "updatedAt"
    >,
  ): EquipmentWorkOrder {
    this.assets.requireEquipment(input.equipmentId);

    const now = new Date().toISOString();

    const workOrder: EquipmentWorkOrder = {
      ...input,
      id: randomUUID(),
      status: "OPEN",
      assignedTechnicianIds: [...input.assignedTechnicianIds],
      openedAt: now,
      updatedAt: now,
    };

    this.workOrders.set(workOrder.id, workOrder);
    return this.cloneWorkOrder(workOrder);
  }

  updateWorkOrderStatus(
    id: string,
    status: EquipmentWorkOrder["status"],
  ): EquipmentWorkOrder {
    const workOrder = this.requireWorkOrder(id);
    const now = new Date().toISOString();

    workOrder.status = status;
    workOrder.updatedAt = now;

    if (status === "IN_PROGRESS" || status === "WAITING_PARTS") {
      this.assets.updateLifecycleStatus(
        workOrder.equipmentId,
        "IN_MAINTENANCE",
      );
    }

    if (status === "COMPLETED") {
      workOrder.completedAt = now;
      this.assets.updateLifecycleStatus(
        workOrder.equipmentId,
        "AVAILABLE",
      );
    }

    this.workOrders.set(id, workOrder);
    return this.cloneWorkOrder(workOrder);
  }

  createRentalContract(
    input: Omit<
      EquipmentRentalContract,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): EquipmentRentalContract {
    const asset = this.assets.requireEquipment(input.equipmentId);

    if (!["AVAILABLE", "RESERVED"].includes(asset.lifecycleStatus)) {
      throw new Error(
        `Equipment is not rentable in status: ${asset.lifecycleStatus}`,
      );
    }

    if (new Date(input.endAt) <= new Date(input.startAt)) {
      throw new Error("Rental end date must be after start date");
    }

    const now = new Date().toISOString();

    const contract: EquipmentRentalContract = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.rentals.set(contract.id, contract);
    return { ...contract };
  }

  updateRentalStatus(
    id: string,
    status: EquipmentRentalContract["status"],
  ): EquipmentRentalContract {
    const contract = this.requireRental(id);
    contract.status = status;
    contract.updatedAt = new Date().toISOString();

    if (status === "APPROVED") {
      this.assets.updateLifecycleStatus(contract.equipmentId, "RESERVED");
    }

    if (status === "ACTIVE") {
      this.assets.updateLifecycleStatus(contract.equipmentId, "RENTED");
    }

    if (status === "COMPLETED" || status === "CANCELLED") {
      this.assets.updateLifecycleStatus(contract.equipmentId, "AVAILABLE");
    }

    this.rentals.set(id, contract);
    return { ...contract };
  }

  createListing(
    input: Omit<
      EquipmentListing,
      "id" | "published" | "createdAt" | "updatedAt"
    >,
  ): EquipmentListing {
    this.assets.requireEquipment(input.equipmentId);

    const now = new Date().toISOString();

    const listing: EquipmentListing = {
      ...input,
      id: randomUUID(),
      published: false,
      createdAt: now,
      updatedAt: now,
    };

    this.listings.set(listing.id, listing);
    return { ...listing };
  }

  publishListing(id: string): EquipmentListing {
    const listing = this.requireListing(id);
    listing.published = true;
    listing.updatedAt = new Date().toISOString();
    this.listings.set(id, listing);

    this.assets.updateLifecycleStatus(
      listing.equipmentId,
      "AVAILABLE",
    );

    return { ...listing };
  }

  getOperationalSnapshot() {
    const activeDeployments = Array.from(this.deployments.values()).filter(
      (item) => item.status === "ACTIVE",
    );

    const openWorkOrders = Array.from(this.workOrders.values()).filter(
      (item) =>
        !["COMPLETED", "CANCELLED"].includes(item.status),
    );

    const activeRentals = Array.from(this.rentals.values()).filter(
      (item) => item.status === "ACTIVE",
    );

    const failedInspections = Array.from(this.inspections.values()).filter(
      (item) => item.result === "FAIL",
    );

    return {
      deployments: this.deployments.size,
      activeDeployments: activeDeployments.length,
      inspections: this.inspections.size,
      failedInspections: failedInspections.length,
      workOrders: this.workOrders.size,
      openWorkOrders: openWorkOrders.length,
      rentals: this.rentals.size,
      activeRentals: activeRentals.length,
      listings: this.listings.size,
      publishedListings: Array.from(this.listings.values()).filter(
        (item) => item.published,
      ).length,
    };
  }

  private requireDeployment(id: string): EquipmentDeployment {
    const value = this.deployments.get(id);
    if (!value) throw new Error(`Equipment deployment not found: ${id}`);
    return value;
  }

  private requireWorkOrder(id: string): EquipmentWorkOrder {
    const value = this.workOrders.get(id);
    if (!value) throw new Error(`Equipment work order not found: ${id}`);
    return value;
  }

  private requireRental(id: string): EquipmentRentalContract {
    const value = this.rentals.get(id);
    if (!value) throw new Error(`Equipment rental contract not found: ${id}`);
    return value;
  }

  private requireListing(id: string): EquipmentListing {
    const value = this.listings.get(id);
    if (!value) throw new Error(`Equipment listing not found: ${id}`);
    return value;
  }

  private cloneInspection(value: EquipmentInspection): EquipmentInspection {
    return {
      ...value,
      checklist: value.checklist.map((item) => ({ ...item })),
      defects: [...value.defects],
    };
  }

  private cloneWorkOrder(value: EquipmentWorkOrder): EquipmentWorkOrder {
    return {
      ...value,
      assignedTechnicianIds: [...value.assignedTechnicianIds],
    };
  }
}