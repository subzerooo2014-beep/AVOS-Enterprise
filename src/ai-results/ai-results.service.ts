import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async getVehicleResults(vehicleId: string) {
    return (this.prisma as any).brainTask.findMany({
      where: {
        entityType: "vehicle",
        entityId: vehicleId,
        status: "completed",
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        taskType: true,
        output: true,
        updatedAt: true,
      },
    });
  }
}
