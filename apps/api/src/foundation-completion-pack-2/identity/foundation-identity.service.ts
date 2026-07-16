import { Injectable, NotFoundException } from "@nestjs/common";
import { FoundationIdentity, FoundationIdentityType } from "../foundation-pack-2.types";

@Injectable()
export class FoundationIdentityService {
  private readonly identities = new Map<string, FoundationIdentity>([
    [
      "identity:avos-platform",
      {
        id: "identity:avos-platform",
        type: "organization",
        name: "AVOS Platform",
        owner: "AVOS",
        trustLevel: 100,
        authorityLevel: "execute",
        status: "active",
        createdAt: new Date().toISOString()
      }
    ],
    [
      "identity:foundation-control-plane",
      {
        id: "identity:foundation-control-plane",
        type: "service",
        name: "Foundation Control Plane",
        owner: "identity:avos-platform",
        trustLevel: 95,
        authorityLevel: "execute-with-approval",
        status: "active",
        createdAt: new Date().toISOString()
      }
    ]
  ]);

  list() {
    return Array.from(this.identities.values());
  }

  get(id: string) {
    const identity = this.identities.get(id);
    if (!identity) {
      throw new NotFoundException(`Foundation identity not found: ${id}`);
    }
    return identity;
  }

  register(input: {
    id: string;
    type: FoundationIdentityType;
    name: string;
    owner: string;
    trustLevel?: number;
    authorityLevel?: FoundationIdentity["authorityLevel"];
  }) {
    const identity: FoundationIdentity = {
      id: input.id,
      type: input.type,
      name: input.name,
      owner: input.owner,
      trustLevel: Math.max(0, Math.min(100, input.trustLevel ?? 70)),
      authorityLevel: input.authorityLevel ?? "recommend",
      status: "active",
      createdAt: new Date().toISOString()
    };

    this.identities.set(identity.id, identity);
    return identity;
  }

  summary() {
    const items = this.list();
    return {
      total: items.length,
      active: items.filter((item) => item.status === "active").length,
      byType: items.reduce<Record<string, number>>((acc, item) => {
        acc[item.type] = (acc[item.type] ?? 0) + 1;
        return acc;
      }, {})
    };
  }
}
