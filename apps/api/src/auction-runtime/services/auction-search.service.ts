import { Injectable } from "@nestjs/common";
import { AuctionRepositoryService } from "./auction-repository.service";
@Injectable()
export class AuctionSearchService {
  constructor(private readonly repo: AuctionRepositoryService) {}
  search(status?: string) {
    return this.repo.list().filter((item) => !status || item.status === status);
  }
}
