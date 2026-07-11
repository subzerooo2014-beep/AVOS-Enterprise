import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AvosEvent } from "../contracts/avos-event.interface";

@Injectable()
export class DeadLetterService {
  constructor(private prisma: PrismaService) {}

  async capture(event: AvosEvent, error: any) {
    await (this.prisma as any).platformEvent.update({
      where: { id: event.id },
      data: {
        status: "failed",
        result: {
          error: error?.message || String(error),
          failedAt: new Date().toISOString(),
        },
      },
    });
  }
}
