import { Injectable, NotFoundException } from "@nestjs/common";
import {
  IntegrationRequest,
  IntegrationStatus,
  PartnerProfile,
  PartnerType,
} from "./super-app-v4.types";

@Injectable()
export class SuperAppV4PartnerGatewayService {
  private readonly partners = new Map<string, PartnerProfile>();
  private readonly requests = new Map<string, IntegrationRequest>();

  constructor() {
    this.seedPartners();
  }

  private seedPartners() {
    const defaults: PartnerProfile[] = [
      {
        id: "partner_finance_default",
        name: "AVOS Finance Gateway",
        type: "FINANCE",
        enabled: true,
        endpoint: "https://partners.local/finance",
        timeoutMs: 8000,
        maxRetries: 3,
        trustScore: 92,
      },
      {
        id: "partner_insurance_default",
        name: "AVOS Insurance Gateway",
        type: "INSURANCE",
        enabled: true,
        endpoint: "https://partners.local/insurance",
        timeoutMs: 8000,
        maxRetries: 3,
        trustScore: 91,
      },
      {
        id: "partner_inspection_default",
        name: "AVOS Inspection Gateway",
        type: "INSPECTION",
        enabled: true,
        endpoint: "https://partners.local/inspection",
        timeoutMs: 10000,
        maxRetries: 2,
        trustScore: 94,
      },
      {
        id: "partner_payment_default",
        name: "AVOS Payment Gateway",
        type: "PAYMENT",
        enabled: true,
        endpoint: "https://partners.local/payment",
        timeoutMs: 6000,
        maxRetries: 3,
        trustScore: 95,
      },
      {
        id: "partner_shipping_default",
        name: "AVOS Shipping Gateway",
        type: "SHIPPING",
        enabled: true,
        endpoint: "https://partners.local/shipping",
        timeoutMs: 10000,
        maxRetries: 3,
        trustScore: 90,
      },
      {
        id: "partner_export_default",
        name: "AVOS Export Gateway",
        type: "EXPORT",
        enabled: true,
        endpoint: "https://partners.local/export",
        timeoutMs: 12000,
        maxRetries: 2,
        trustScore: 89,
      },
    ];

    for (const partner of defaults) {
      this.partners.set(partner.id, partner);
    }
  }

  listPartners(): PartnerProfile[] {
    return [...this.partners.values()];
  }

  findPartner(type: PartnerType): PartnerProfile {
    const partner = this.listPartners().find(
      (item) => item.type === type && item.enabled,
    );
    if (!partner) throw new NotFoundException(`No enabled partner for ${type}`);
    return partner;
  }

  createRequest(input: {
    dealId: string;
    partnerType: PartnerType;
    payload: Record<string, unknown>;
    callbackUrl?: string;
  }): IntegrationRequest {
    const partner = this.findPartner(input.partnerType);
    const now = new Date().toISOString();
    const request: IntegrationRequest = {
      id: `int_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      dealId: input.dealId,
      partnerId: partner.id,
      partnerType: partner.type,
      status: "CREATED",
      payload: input.payload,
      attempts: 0,
      maxRetries: partner.maxRetries,
      callbackUrl: input.callbackUrl,
      createdAt: now,
      updatedAt: now,
    };

    this.requests.set(request.id, request);
    return request;
  }

  submit(id: string): IntegrationRequest {
    const request = this.getRequest(id);
    request.attempts += 1;
    request.status = "SUBMITTED";
    request.updatedAt = new Date().toISOString();

    request.status = "PENDING";
    request.response = {
      accepted: true,
      providerReference: `ref_${request.id}`,
    };
    request.updatedAt = new Date().toISOString();

    return request;
  }

  updateStatus(
    id: string,
    status: IntegrationStatus,
    response?: Record<string, unknown>,
  ): IntegrationRequest {
    const request = this.getRequest(id);
    request.status = status;
    if (response) request.response = response;
    request.updatedAt = new Date().toISOString();
    return request;
  }

  fail(id: string, error: string): IntegrationRequest {
    const request = this.getRequest(id);
    request.lastError = error;
    request.status =
      request.attempts < request.maxRetries ? "RETRYING" : "FAILED";
    request.updatedAt = new Date().toISOString();
    return request;
  }

  retry(id: string): IntegrationRequest {
    const request = this.getRequest(id);
    if (request.attempts >= request.maxRetries) {
      request.status = "FAILED";
      request.updatedAt = new Date().toISOString();
      return request;
    }
    return this.submit(id);
  }

  getRequest(id: string): IntegrationRequest {
    const request = this.requests.get(id);
    if (!request) {
      throw new NotFoundException(`Integration request ${id} not found`);
    }
    return request;
  }

  listRequests(): IntegrationRequest[] {
    return [...this.requests.values()];
  }

  dashboard() {
    const requests = this.listRequests();
    const partners = this.listPartners();

    return {
      totalPartners: partners.length,
      enabledPartners: partners.filter((partner) => partner.enabled).length,
      totalRequests: requests.length,
      pendingRequests: requests.filter((request) =>
        ["CREATED", "SUBMITTED", "PENDING", "RETRYING"].includes(request.status),
      ).length,
      completedRequests: requests.filter(
        (request) => request.status === "COMPLETED",
      ).length,
      failedRequests: requests.filter(
        (request) => request.status === "FAILED",
      ).length,
      byType: requests.reduce<Record<string, number>>((acc, request) => {
        acc[request.partnerType] = (acc[request.partnerType] ?? 0) + 1;
        return acc;
      }, {}),
      byStatus: requests.reduce<Record<string, number>>((acc, request) => {
        acc[request.status] = (acc[request.status] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }
}
