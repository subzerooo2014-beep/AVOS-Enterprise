import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FieldServiceRequest,
  InspectionRecord,
  PartsOrder,
  ServiceBooking,
  ServiceStatus,
  WarrantyClaim,
  WarrantyRecord,
  WorkshopJob,
} from "./industry-services-ecosystem.types";
import {
  INDUSTRY_SERVICES_COMPONENTS,
  SUPPORTED_SERVICE_INDUSTRIES,
} from "./industry-services-ecosystem.registry";

@Injectable()
export class IndustryServicesEcosystemService {
  private readonly bookings = new Map<string, ServiceBooking>();
  private readonly jobs = new Map<string, WorkshopJob>();
  private readonly inspections = new Map<string, InspectionRecord>();
  private readonly warranties = new Map<string, WarrantyRecord>();
  private readonly claims = new Map<string, WarrantyClaim>();
  private readonly partsOrders = new Map<string, PartsOrder>();
  private readonly fieldServices = new Map<string, FieldServiceRequest>();

  components() {
    return {
      system: "AVOS Industry Services Ecosystem Core",
      architecture: "INDUSTRY_BASED",
      components: [...INDUSTRY_SERVICES_COMPONENTS],
      industries: [...SUPPORTED_SERVICE_INDUSTRIES],
      status: "READY",
    };
  }

  createBooking(
    input: Omit<ServiceBooking, "id" | "status" | "createdAt" | "updatedAt">,
  ): ServiceBooking {
    this.requireIndustry(input.industryKey);
    const now = new Date().toISOString();

    const booking: ServiceBooking = {
      ...input,
      id: randomUUID(),
      status: "REQUESTED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.bookings.set(booking.id, booking);
    return this.cloneBooking(booking);
  }

  updateBookingStatus(id: string, status: ServiceStatus): ServiceBooking {
    const booking = this.requireBooking(id);
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    this.bookings.set(id, booking);
    return this.cloneBooking(booking);
  }

  createWorkshopJob(
    input: Omit<WorkshopJob, "id" | "status" | "createdAt" | "updatedAt">,
  ): WorkshopJob {
    this.requireBooking(input.bookingId);
    const now = new Date().toISOString();

    const job: WorkshopJob = {
      ...input,
      id: randomUUID(),
      status: "SCHEDULED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(job.id, job);
    return this.cloneJob(job);
  }

  assignTechnician(jobId: string, technicianId: string): WorkshopJob {
    const job = this.requireJob(jobId);
    job.technicianId = technicianId;
    job.updatedAt = new Date().toISOString();
    this.jobs.set(job.id, job);
    return this.cloneJob(job);
  }

  createInspection(
    input: Omit<InspectionRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): InspectionRecord {
    this.requireIndustry(input.industryKey);
    const now = new Date().toISOString();

    const inspection: InspectionRecord = {
      ...input,
      id: randomUUID(),
      status: "REQUESTED",
      evidence: [...input.evidence],
      findings: { ...input.findings },
      createdAt: now,
      updatedAt: now,
    };

    this.inspections.set(inspection.id, inspection);
    return this.cloneInspection(inspection);
  }

  completeInspection(
    id: string,
    grade: string,
    certificateNumber: string,
  ): InspectionRecord {
    const inspection = this.requireInspection(id);
    inspection.grade = grade;
    inspection.certificateNumber = certificateNumber;
    inspection.status = "COMPLETED";
    inspection.updatedAt = new Date().toISOString();
    this.inspections.set(id, inspection);
    return this.cloneInspection(inspection);
  }

  createWarranty(
    input: Omit<WarrantyRecord, "id" | "status" | "createdAt" | "updatedAt">,
  ): WarrantyRecord {
    this.requireIndustry(input.industryKey);
    const now = new Date().toISOString();

    const warranty: WarrantyRecord = {
      ...input,
      id: randomUUID(),
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    this.warranties.set(warranty.id, warranty);
    return { ...warranty };
  }

  createWarrantyClaim(
    input: Omit<WarrantyClaim, "id" | "status" | "createdAt" | "updatedAt">,
  ): WarrantyClaim {
    this.requireWarranty(input.warrantyId);
    const now = new Date().toISOString();

    const claim: WarrantyClaim = {
      ...input,
      id: randomUUID(),
      status: "SUBMITTED",
      createdAt: now,
      updatedAt: now,
    };

    this.claims.set(claim.id, claim);
    return { ...claim };
  }

  approveWarrantyClaim(id: string): WarrantyClaim {
    const claim = this.requireClaim(id);
    claim.status = "APPROVED";
    claim.updatedAt = new Date().toISOString();
    this.claims.set(id, claim);
    return { ...claim };
  }

  createPartsOrder(
    input: Omit<PartsOrder, "id" | "total" | "status" | "createdAt" | "updatedAt">,
  ): PartsOrder {
    this.requireIndustry(input.industryKey);

    const total = Number(
      input.items
        .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
        .toFixed(2),
    );

    const now = new Date().toISOString();
    const order: PartsOrder = {
      ...input,
      id: randomUUID(),
      items: input.items.map((item) => ({ ...item })),
      total,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.partsOrders.set(order.id, order);
    return this.clonePartsOrder(order);
  }

  confirmPartsOrder(id: string): PartsOrder {
    const order = this.requirePartsOrder(id);
    order.status = "CONFIRMED";
    order.updatedAt = new Date().toISOString();
    this.partsOrders.set(id, order);
    return this.clonePartsOrder(order);
  }

  createFieldService(
    input: Omit<FieldServiceRequest, "id" | "status" | "createdAt" | "updatedAt">,
  ): FieldServiceRequest {
    this.requireIndustry(input.industryKey);
    const now = new Date().toISOString();

    const request: FieldServiceRequest = {
      ...input,
      id: randomUUID(),
      status: "REQUESTED",
      createdAt: now,
      updatedAt: now,
    };

    this.fieldServices.set(request.id, request);
    return { ...request };
  }

  dashboard() {
    return {
      system: "AVOS Industry Services Ecosystem Core",
      architecture: "INDUSTRY_BASED",
      bookings: this.bookings.size,
      workshopJobs: this.jobs.size,
      inspections: this.inspections.size,
      warranties: this.warranties.size,
      warrantyClaims: this.claims.size,
      partsOrders: this.partsOrders.size,
      fieldServices: this.fieldServices.size,
      components: INDUSTRY_SERVICES_COMPONENTS.length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireIndustry(key: string) {
    if (
      !SUPPORTED_SERVICE_INDUSTRIES.includes(
        key as (typeof SUPPORTED_SERVICE_INDUSTRIES)[number],
      )
    ) {
      throw new Error(`Unsupported industry: ${key}`);
    }
  }

  private requireBooking(id: string): ServiceBooking {
    const value = this.bookings.get(id);
    if (!value) {
      throw new Error(`Booking not found: ${id}`);
    }
    return value;
  }

  private requireJob(id: string): WorkshopJob {
    const value = this.jobs.get(id);
    if (!value) {
      throw new Error(`Workshop job not found: ${id}`);
    }
    return value;
  }

  private requireInspection(id: string): InspectionRecord {
    const value = this.inspections.get(id);
    if (!value) {
      throw new Error(`Inspection not found: ${id}`);
    }
    return value;
  }

  private requireWarranty(id: string): WarrantyRecord {
    const value = this.warranties.get(id);
    if (!value) {
      throw new Error(`Warranty not found: ${id}`);
    }
    return value;
  }

  private requireClaim(id: string): WarrantyClaim {
    const value = this.claims.get(id);
    if (!value) {
      throw new Error(`Warranty claim not found: ${id}`);
    }
    return value;
  }

  private requirePartsOrder(id: string): PartsOrder {
    const value = this.partsOrders.get(id);
    if (!value) {
      throw new Error(`Parts order not found: ${id}`);
    }
    return value;
  }

  private cloneBooking(value: ServiceBooking): ServiceBooking {
    return { ...value, metadata: { ...value.metadata } };
  }

  private cloneJob(value: WorkshopJob): WorkshopJob {
    return { ...value, metadata: { ...value.metadata } };
  }

  private cloneInspection(value: InspectionRecord): InspectionRecord {
    return {
      ...value,
      evidence: [...value.evidence],
      findings: { ...value.findings },
    };
  }

  private clonePartsOrder(value: PartsOrder): PartsOrder {
    return {
      ...value,
      items: value.items.map((item) => ({ ...item })),
    };
  }
}