import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TransactionManagerService {
  constructor(private prisma: PrismaService) {}

  run<T>(handler: (tx: any) => Promise<T>) {
    return this.prisma.$transaction(handler as any);
  }
}
