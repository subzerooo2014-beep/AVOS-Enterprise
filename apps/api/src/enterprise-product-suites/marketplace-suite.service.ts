import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { MarketplacePortalProfile } from "./enterprise-product-suites.types";

@Injectable()
export class MarketplaceSuiteService {
  private readonly portals = new Map<string, MarketplacePortalProfile>();

  createPortal(
    input: Omit<MarketplacePortalProfile, "id" | "createdAt" | "updatedAt">,
  ): MarketplacePortalProfile {
    const now = new Date().toISOString();

    const portal: MarketplacePortalProfile = {
      ...input,
      id: randomUUID(),
      capabilities: [...input.capabilities],
      createdAt: now,
      updatedAt: now,
    };

    this.portals.set(portal.id, portal);
    return this.clone(portal);
  }

  updateCapabilities(
    id: string,
    capabilities: string[],
  ): MarketplacePortalProfile {
    const portal = this.requirePortal(id);
    portal.capabilities = [...new Set(capabilities)];
    portal.updatedAt = new Date().toISOString();
    this.portals.set(id, portal);
    return this.clone(portal);
  }

  dashboard() {
    const portals = Array.from(this.portals.values());

    return {
      portals: portals.length,
      dealers: portals.filter((item) => item.portalType === "DEALER").length,
      sellers: portals.filter((item) => item.portalType === "SELLER").length,
      buyers: portals.filter((item) => item.portalType === "BUYER").length,
      active: portals.filter((item) => item.active).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requirePortal(id: string): MarketplacePortalProfile {
    const portal = this.portals.get(id);
    if (!portal) {
      throw new Error(`Marketplace portal not found: ${id}`);
    }
    return portal;
  }

  private clone(portal: MarketplacePortalProfile): MarketplacePortalProfile {
    return {
      ...portal,
      capabilities: [...portal.capabilities],
    };
  }
}