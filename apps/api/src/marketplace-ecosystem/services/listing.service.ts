import { Injectable } from "@nestjs/common";
import { ListingPolicy } from "../policies/listing.policy";
import { ListingRepositoryService } from "./listing-repository.service";
import { marketplaceId } from "../marketplace-ecosystem.utils";
@Injectable()
export class ListingService {
  constructor(
    private readonly policy: ListingPolicy,
    private readonly repo: ListingRepositoryService,
  ) {}
  create(input: { entityId: string; category: string; title: string; description: string; price: number; stock: number }) {
    this.policy.validate(input.title, input.description, input.price, input.stock);
    const now = new Date().toISOString();
    return this.repo.save({
      id: marketplaceId("listing"),
      ...input,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }
}
