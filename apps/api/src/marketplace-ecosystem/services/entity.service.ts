import { Injectable } from "@nestjs/common";
import { EntityPolicy } from "../policies/entity.policy";
import { EntityRepositoryService } from "./entity-repository.service";
import { marketplaceId } from "../marketplace-ecosystem.utils";
@Injectable()
export class EntityService {
  constructor(
    private readonly policy: EntityPolicy,
    private readonly repo: EntityRepositoryService,
  ) {}
  create(input: { type: any; ownerId: string; name: string }) {
    this.policy.validate(input.name, input.type);
    const now = new Date().toISOString();
    return this.repo.save({
      id: marketplaceId("entity"),
      ...input,
      status: "DRAFT",
      trustScore: 70,
      rating: 0,
      createdAt: now,
      updatedAt: now,
    });
  }
  verify(id: string, approved: boolean) {
    const record = this.repo.get(id);
    record.status = approved ? "VERIFIED" : "REJECTED";
    record.updatedAt = new Date().toISOString();
    return record;
  }
}
