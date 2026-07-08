import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BaseRepository } from "../../common/repositories/base.repository";

@Injectable()
export class BranchesRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  list(page = 1, limit = 20, where: any = {}): Promise<any> {
    return super.paginate((this.prisma as any)["branch"], { where }, page, limit);
  }
}
