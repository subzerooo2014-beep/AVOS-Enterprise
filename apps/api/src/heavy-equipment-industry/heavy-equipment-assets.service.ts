import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EquipmentLifecycleStatus,
  EquipmentSite,
  HeavyEquipmentAsset,
  SparePartInventoryItem,
} from "./heavy-equipment-industry.types";

@Injectable()
export class HeavyEquipmentAssetsService {
  private readonly equipment = new Map<string, HeavyEquipmentAsset>();
  private readonly serialIndex = new Map<string, string>();
  private readonly fleetIndex = new Map<string, string>();
  private readonly sites = new Map<string, EquipmentSite>();
  private readonly spareParts = new Map<string, SparePartInventoryItem>();
  private readonly sparePartSkuIndex = new Map<string, string>();

  createEquipment(
    input: Omit<
      HeavyEquipmentAsset,
      "id" | "lifecycleStatus" | "createdAt" | "updatedAt"
    >,
  ): HeavyEquipmentAsset {
    const serialNumber = input.serialNumber.trim().toUpperCase();
    const fleetNumber = input.fleetNumber.trim().toUpperCase();

    if (!serialNumber) throw new Error("Equipment serial number is required");
    if (!fleetNumber) throw new Error("Equipment fleet number is required");

    if (this.serialIndex.has(serialNumber)) {
      throw new Error(`Equipment serial number already exists: ${serialNumber}`);
    }

    if (this.fleetIndex.has(fleetNumber)) {
      throw new Error(`Equipment fleet number already exists: ${fleetNumber}`);
    }

    if (input.operatingHours < 0) {
      throw new Error("Operating hours cannot be negative");
    }

    const now = new Date().toISOString();

    const asset: HeavyEquipmentAsset = {
      ...input,
      id: randomUUID(),
      serialNumber,
      fleetNumber,
      lifecycleStatus: "DRAFT",
      specifications: { ...input.specifications },
      documentIds: [...input.documentIds],
      createdAt: now,
      updatedAt: now,
    };

    this.equipment.set(asset.id, asset);
    this.serialIndex.set(serialNumber, asset.id);
    this.fleetIndex.set(fleetNumber, asset.id);

    return this.cloneEquipment(asset);
  }

  updateLifecycleStatus(
    id: string,
    status: EquipmentLifecycleStatus,
  ): HeavyEquipmentAsset {
    const asset = this.requireEquipment(id);
    asset.lifecycleStatus = status;
    asset.updatedAt = new Date().toISOString();
    this.equipment.set(id, asset);
    return this.cloneEquipment(asset);
  }

  assignOwner(id: string, ownerId: string): HeavyEquipmentAsset {
    const asset = this.requireEquipment(id);
    asset.ownerId = ownerId;
    asset.updatedAt = new Date().toISOString();
    this.equipment.set(id, asset);
    return this.cloneEquipment(asset);
  }

  updateValuation(
    id: string,
    marketValue: number,
    bookValue: number,
  ): HeavyEquipmentAsset {
    if (marketValue < 0 || bookValue < 0) {
      throw new Error("Equipment valuation cannot be negative");
    }

    const asset = this.requireEquipment(id);
    asset.marketValue = marketValue;
    asset.bookValue = bookValue;
    asset.updatedAt = new Date().toISOString();
    this.equipment.set(id, asset);
    return this.cloneEquipment(asset);
  }

  createSite(
    input: Omit<EquipmentSite, "id" | "createdAt" | "updatedAt">,
  ): EquipmentSite {
    const now = new Date().toISOString();

    const site: EquipmentSite = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.sites.set(site.id, site);
    return { ...site };
  }

  assignSite(equipmentId: string, siteId: string): HeavyEquipmentAsset {
    const asset = this.requireEquipment(equipmentId);
    this.requireSite(siteId);

    asset.currentSiteId = siteId;
    asset.updatedAt = new Date().toISOString();

    this.equipment.set(asset.id, asset);
    return this.cloneEquipment(asset);
  }

  createSparePart(
    input: Omit<SparePartInventoryItem, "id" | "updatedAt">,
  ): SparePartInventoryItem {
    const sku = input.sku.trim().toUpperCase();

    if (this.sparePartSkuIndex.has(sku)) {
      throw new Error(`Spare part SKU already exists: ${sku}`);
    }

    if (input.quantityOnHand < 0 || input.reorderPoint < 0) {
      throw new Error("Spare part quantities cannot be negative");
    }

    const item: SparePartInventoryItem = {
      ...input,
      id: randomUUID(),
      sku,
      compatibleCategories: [...input.compatibleCategories],
      updatedAt: new Date().toISOString(),
    };

    this.spareParts.set(item.id, item);
    this.sparePartSkuIndex.set(sku, item.id);

    return this.cloneSparePart(item);
  }

  adjustSparePartQuantity(
    id: string,
    adjustment: number,
  ): SparePartInventoryItem {
    const item = this.requireSparePart(id);
    const nextQuantity = item.quantityOnHand + adjustment;

    if (nextQuantity < 0) {
      throw new Error("Spare part inventory cannot become negative");
    }

    item.quantityOnHand = nextQuantity;
    item.updatedAt = new Date().toISOString();
    this.spareParts.set(id, item);

    return this.cloneSparePart(item);
  }

  listEquipment(filters?: {
    tenantId?: string;
    category?: HeavyEquipmentAsset["category"];
    status?: EquipmentLifecycleStatus;
    siteId?: string;
  }): HeavyEquipmentAsset[] {
    return Array.from(this.equipment.values())
      .filter((item) => !filters?.tenantId || item.tenantId === filters.tenantId)
      .filter((item) => !filters?.category || item.category === filters.category)
      .filter((item) => !filters?.status || item.lifecycleStatus === filters.status)
      .filter((item) => !filters?.siteId || item.currentSiteId === filters.siteId)
      .map((item) => this.cloneEquipment(item));
  }

  listSites(tenantId?: string): EquipmentSite[] {
    return Array.from(this.sites.values())
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => ({ ...item }));
  }

  listLowStockParts(tenantId?: string): SparePartInventoryItem[] {
    return Array.from(this.spareParts.values())
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .filter((item) => item.quantityOnHand <= item.reorderPoint)
      .map((item) => this.cloneSparePart(item));
  }

  getEquipment(id: string): HeavyEquipmentAsset {
    return this.cloneEquipment(this.requireEquipment(id));
  }

  requireEquipment(id: string): HeavyEquipmentAsset {
    const value = this.equipment.get(id);
    if (!value) throw new Error(`Heavy equipment asset not found: ${id}`);
    return value;
  }

  requireSite(id: string): EquipmentSite {
    const value = this.sites.get(id);
    if (!value) throw new Error(`Equipment site not found: ${id}`);
    return value;
  }

  private requireSparePart(id: string): SparePartInventoryItem {
    const value = this.spareParts.get(id);
    if (!value) throw new Error(`Spare part not found: ${id}`);
    return value;
  }

  private cloneEquipment(value: HeavyEquipmentAsset): HeavyEquipmentAsset {
    return {
      ...value,
      specifications: { ...value.specifications },
      documentIds: [...value.documentIds],
    };
  }

  private cloneSparePart(
    value: SparePartInventoryItem,
  ): SparePartInventoryItem {
    return {
      ...value,
      compatibleCategories: [...value.compatibleCategories],
    };
  }
}