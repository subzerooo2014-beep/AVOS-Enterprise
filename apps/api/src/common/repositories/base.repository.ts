import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { buildPagination } from "../pagination/pagination.util";

@Injectable()
export class BaseRepository {
  constructor(protected prisma: PrismaService) {}

  async paginate(model: any, args: any = {}, page = 1, limit = 20) {
    const p = buildPagination(page, limit);

    const [data, total] = await Promise.all([
      model.findMany({
        ...args,
        skip: p.skip,
        take: p.take,
      }),
      model.count({
        where: args.where,
      }),
    ]);

    return {
      data,
      page: p.page,
      limit: p.limit,
      total,
      totalPages: Math.ceil(total / p.limit),
    };
  }
}
