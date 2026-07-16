import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TransactionManagerService {
  constructor(private readonly prisma: PrismaService) {}

  run<T>(
    handler: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): Promise<T> {
    if (options) {
      return this.prisma.$transaction(handler, options);
    }

    return this.prisma.$transaction(handler);
  }
}
