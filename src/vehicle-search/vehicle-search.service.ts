import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { VehicleSearchDto } from "./dto/vehicle-search.dto";

@Injectable()
export class VehicleSearchService {
  constructor(private prisma: PrismaService) {}

  search(dto: VehicleSearchDto) {
    return (this.prisma as any).vehicle.findMany({
      where: {
        AND: [
          dto.q ? {
            OR: [
              { vin: { contains: dto.q, mode: "insensitive" } },
              { make: { contains: dto.q, mode: "insensitive" } },
              { model: { contains: dto.q, mode: "insensitive" } },
              { color: { contains: dto.q, mode: "insensitive" } },
            ],
          } : {},
          dto.make ? { make: { contains: dto.make, mode: "insensitive" } } : {},
          dto.model ? { model: { contains: dto.model, mode: "insensitive" } } : {},
          dto.yearFrom ? { year: { gte: dto.yearFrom } } : {},
          dto.yearTo ? { year: { lte: dto.yearTo } } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
