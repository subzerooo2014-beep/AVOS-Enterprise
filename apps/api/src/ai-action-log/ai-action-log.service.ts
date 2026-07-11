import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiActionLogService {
  constructor(private readonly prisma: PrismaService) {}

  async write(vehicleId: string, action: string, status: string) {
    return (this.prisma as any).aiActionLog.create({
      data: {
        id: randomUUID(),
        entityType: "vehicle",
        entityId: vehicleId,
        action,
        status,
      },
    });
  }

  async history(vehicleId: string) {
    return (this.prisma as any).aiActionLog.findMany({
      where: {
        entityType: "vehicle",
        entityId: vehicleId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
