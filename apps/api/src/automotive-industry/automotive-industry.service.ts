import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  AutomotiveAiAssessment,
  AutomotiveFinanceApplication,
  AutomotiveLogisticsCase,
  ServiceRecord,
  TradeInRequest,
  VehicleListing,
  VehicleRecord,
  VehicleStatus,
} from "./automotive-industry.types";
import { AUTOMOTIVE_CAPABILITIES } from "./automotive-industry.registry";

@Injectable()
export class AutomotiveIndustryService {
  private readonly vehicles = new Map<string, VehicleRecord>();
  private readonly vinIndex = new Map<string, string>();
  private readonly listings = new Map<string, VehicleListing>();
  private readonly tradeIns = new Map<string, TradeInRequest>();
  private readonly services = new Map<string, ServiceRecord>();
  private readonly financeApplications =
    new Map<string, AutomotiveFinanceApplication>();
  private readonly logistics = new Map<string, AutomotiveLogisticsCase>();
  private readonly aiAssessments =
    new Map<string, AutomotiveAiAssessment>();

  capabilities() {
    return {
      system: "AVOS Automotive Industry Pack",
      capabilities: [...AUTOMOTIVE_CAPABILITIES],
      status: "READY",
    };
  }

  createVehicle(
    input: Omit<VehicleRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): VehicleRecord {
    const normalizedVin = input.vin.trim().toUpperCase();

    if (this.vinIndex.has(normalizedVin)) {
      throw new Error(`Vehicle VIN already exists: ${normalizedVin}`);
    }

    const now = new Date().toISOString();

    const vehicle: VehicleRecord = {
      ...input,
      id: randomUUID(),
      vin: normalizedVin,
      status: "DRAFT",
      attributes: { ...input.attributes },
      documents: [...input.documents],
      createdAt: now,
      updatedAt: now,
    };

    this.vehicles.set(vehicle.id, vehicle);
    this.vinIndex.set(normalizedVin, vehicle.id);

    return this.cloneVehicle(vehicle);
  }

  updateVehicleStatus(
    id: string,
    status: VehicleStatus,
  ): VehicleRecord {
    const vehicle = this.requireVehicle(id);
    vehicle.status = status;
    vehicle.updatedAt = new Date().toISOString();
    this.vehicles.set(id, vehicle);
    return this.cloneVehicle(vehicle);
  }

  assignOwner(
    id: string,
    ownerId: string,
  ): VehicleRecord {
    const vehicle = this.requireVehicle(id);
    vehicle.ownerId = ownerId;
    vehicle.updatedAt = new Date().toISOString();
    this.vehicles.set(id, vehicle);
    return this.cloneVehicle(vehicle);
  }

  createListing(
    input: Omit<VehicleListing, "id" | "published" | "createdAt" | "updatedAt">,
  ): VehicleListing {
    this.requireVehicle(input.vehicleId);

    const now = new Date().toISOString();

    const listing: VehicleListing = {
      ...input,
      id: randomUUID(),
      published: false,
      createdAt: now,
      updatedAt: now,
    };

    this.listings.set(listing.id, listing);
    return { ...listing };
  }

  publishListing(id: string): VehicleListing {
    const listing = this.requireListing(id);
    const vehicle = this.requireVehicle(listing.vehicleId);

    listing.published = true;
    listing.updatedAt = new Date().toISOString();
    this.listings.set(id, listing);

    vehicle.status = "AVAILABLE";
    vehicle.updatedAt = listing.updatedAt;
    this.vehicles.set(vehicle.id, vehicle);

    return { ...listing };
  }

  createTradeIn(
    input: Omit<TradeInRequest, "id" | "status" | "createdAt" | "updatedAt">,
  ): TradeInRequest {
    this.requireVehicle(input.vehicleId);

    const now = new Date().toISOString();

    const request: TradeInRequest = {
      ...input,
      id: randomUUID(),
      status: "REQUESTED",
      createdAt: now,
      updatedAt: now,
    };

    this.tradeIns.set(request.id, request);
    return { ...request };
  }

  assessTradeIn(
    id: string,
    estimatedValue: number,
  ): TradeInRequest {
    const request = this.requireTradeIn(id);
    request.estimatedValue = estimatedValue;
    request.status = "ASSESSED";
    request.updatedAt = new Date().toISOString();
    this.tradeIns.set(id, request);
    return { ...request };
  }

  createServiceRecord(
    input: Omit<ServiceRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): ServiceRecord {
    this.requireVehicle(input.vehicleId);

    const now = new Date().toISOString();

    const record: ServiceRecord = {
      ...input,
      id: randomUUID(),
      status: "BOOKED",
      createdAt: now,
      updatedAt: now,
    };

    this.services.set(record.id, record);
    return { ...record };
  }

  updateServiceStatus(
    id: string,
    status: ServiceRecord["status"],
  ): ServiceRecord {
    const record = this.requireService(id);
    record.status = status;
    record.updatedAt = new Date().toISOString();
    this.services.set(id, record);

    const vehicle = this.requireVehicle(record.vehicleId);
    vehicle.status =
      status === "IN_PROGRESS"
        ? "IN_SERVICE"
        : status === "COMPLETED"
          ? "AVAILABLE"
          : vehicle.status;
    vehicle.updatedAt = record.updatedAt;
    this.vehicles.set(vehicle.id, vehicle);

    return { ...record };
  }

  createFinanceApplication(
    input: Omit<
      AutomotiveFinanceApplication,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): AutomotiveFinanceApplication {
    this.requireVehicle(input.vehicleId);

    const now = new Date().toISOString();

    const application: AutomotiveFinanceApplication = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.financeApplications.set(application.id, application);
    return { ...application };
  }

  updateFinanceStatus(
    id: string,
    status: AutomotiveFinanceApplication["status"],
  ): AutomotiveFinanceApplication {
    const application = this.requireFinanceApplication(id);
    application.status = status;
    application.updatedAt = new Date().toISOString();
    this.financeApplications.set(id, application);
    return { ...application };
  }

  createLogisticsCase(
    input: Omit<
      AutomotiveLogisticsCase,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): AutomotiveLogisticsCase {
    this.requireVehicle(input.vehicleId);

    const now = new Date().toISOString();

    const logisticsCase: AutomotiveLogisticsCase = {
      ...input,
      id: randomUUID(),
      status: "CREATED",
      createdAt: now,
      updatedAt: now,
    };

    this.logistics.set(logisticsCase.id, logisticsCase);
    return { ...logisticsCase };
  }

  updateLogisticsStatus(
    id: string,
    status: AutomotiveLogisticsCase["status"],
    trackingNumber?: string,
  ): AutomotiveLogisticsCase {
    const logisticsCase = this.requireLogistics(id);

    logisticsCase.status = status;
    logisticsCase.trackingNumber =
      trackingNumber ?? logisticsCase.trackingNumber;
    logisticsCase.updatedAt = new Date().toISOString();

    this.logistics.set(id, logisticsCase);

    if (status === "DELIVERED") {
      const vehicle = this.requireVehicle(logisticsCase.vehicleId);
      vehicle.status =
        logisticsCase.type === "EXPORT"
          ? "EXPORTED"
          : vehicle.status;
      vehicle.updatedAt = logisticsCase.updatedAt;
      this.vehicles.set(vehicle.id, vehicle);
    }

    return { ...logisticsCase };
  }

  assessVehicle(
    tenantId: string,
    vehicleId: string,
    type: AutomotiveAiAssessment["type"],
    score: number,
    recommendation: string,
    factors: string[],
  ): AutomotiveAiAssessment {
    this.requireVehicle(vehicleId);

    if (score < 0 || score > 100) {
      throw new Error("AI assessment score must be between 0 and 100");
    }

    const assessment: AutomotiveAiAssessment = {
      id: randomUUID(),
      tenantId,
      vehicleId,
      type,
      score,
      recommendation,
      factors: [...factors],
      createdAt: new Date().toISOString(),
    };

    this.aiAssessments.set(assessment.id, assessment);

    return {
      ...assessment,
      factors: [...assessment.factors],
    };
  }

  search(
    query: string,
    minPrice?: number,
    maxPrice?: number,
  ) {
    const normalized = query.trim().toLowerCase();

    return Array.from(this.vehicles.values())
      .filter((vehicle) =>
        ["AVAILABLE", "RESERVED"].includes(vehicle.status),
      )
      .filter((vehicle) => {
        const haystack =
          `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase();

        return normalized.length === 0 || haystack.includes(normalized);
      })
      .filter(
        (vehicle) =>
          minPrice === undefined || vehicle.price >= minPrice,
      )
      .filter(
        (vehicle) =>
          maxPrice === undefined || vehicle.price <= maxPrice,
      )
      .map((vehicle) => this.cloneVehicle(vehicle));
  }

  dashboard() {
    const vehicles = Array.from(this.vehicles.values());
    const listings = Array.from(this.listings.values());

    return {
      system: "AVOS Automotive Industry Pack",
      vehicles: vehicles.length,
      availableVehicles: vehicles.filter(
        (item) => item.status === "AVAILABLE",
      ).length,
      reservedVehicles: vehicles.filter(
        (item) => item.status === "RESERVED",
      ).length,
      soldVehicles: vehicles.filter(
        (item) => item.status === "SOLD",
      ).length,
      publishedListings: listings.filter(
        (item) => item.published,
      ).length,
      tradeIns: this.tradeIns.size,
      serviceRecords: this.services.size,
      financeApplications: this.financeApplications.size,
      logisticsCases: this.logistics.size,
      aiAssessments: this.aiAssessments.size,
      inventoryValue: Number(
        vehicles
          .filter((item) =>
            ["AVAILABLE", "RESERVED"].includes(item.status),
          )
          .reduce((sum, item) => sum + item.price, 0)
          .toFixed(2),
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireVehicle(id: string): VehicleRecord {
    const value = this.vehicles.get(id);
    if (!value) throw new Error(`Vehicle not found: ${id}`);
    return value;
  }

  private requireListing(id: string): VehicleListing {
    const value = this.listings.get(id);
    if (!value) throw new Error(`Vehicle listing not found: ${id}`);
    return value;
  }

  private requireTradeIn(id: string): TradeInRequest {
    const value = this.tradeIns.get(id);
    if (!value) throw new Error(`Trade-in request not found: ${id}`);
    return value;
  }

  private requireService(id: string): ServiceRecord {
    const value = this.services.get(id);
    if (!value) throw new Error(`Service record not found: ${id}`);
    return value;
  }

  private requireFinanceApplication(
    id: string,
  ): AutomotiveFinanceApplication {
    const value = this.financeApplications.get(id);
    if (!value) {
      throw new Error(`Finance application not found: ${id}`);
    }
    return value;
  }

  private requireLogistics(id: string): AutomotiveLogisticsCase {
    const value = this.logistics.get(id);
    if (!value) throw new Error(`Logistics case not found: ${id}`);
    return value;
  }

  private cloneVehicle(value: VehicleRecord): VehicleRecord {
    return {
      ...value,
      attributes: { ...value.attributes },
      documents: [...value.documents],
    };
  }
}