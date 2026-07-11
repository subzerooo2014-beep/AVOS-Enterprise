import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";

@Injectable()
export class LeadsRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  paginateLeads(page = 1, limit = 20, where: any = {}) {
    return this.paginate((this.prisma as any).lead, { where }, page, limit);
  }
}
