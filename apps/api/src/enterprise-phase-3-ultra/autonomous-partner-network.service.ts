import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PartnerNode } from "./enterprise-phase-3-ultra.types";

@Injectable()
export class AutonomousPartnerNetworkService {
  private readonly partners: PartnerNode[] = [];

  register(name: string, role: string, trustScore = 90): PartnerNode {
    const partner: PartnerNode = {
      id: randomUUID(),
      name,
      role,
      trustScore: Math.min(100, Math.max(0, Math.round(trustScore))),
      active: true,
    };

    this.partners.push(partner);
    return partner;
  }

  coordinate(workflow: string) {
    const active = this.partners.filter((partner) => partner.active);
    const trustScore =
      active.length === 0
        ? 0
        : Math.round(
            active.reduce((sum, partner) => sum + partner.trustScore, 0) /
              active.length,
          );

    return {
      workflow,
      partners: active.map((partner) => partner.name),
      coordinated: active.length >= 2,
      trustScore,
      completedAt: new Date().toISOString(),
    };
  }

  count(): number {
    return this.partners.length;
  }
}