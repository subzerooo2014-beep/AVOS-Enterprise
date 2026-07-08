import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["accounting"]?.findMany?.() ?? [];
  }

  create(dto: any) {
    return (this.prisma as any)["accounting"]?.create?.({ data: dto }) ?? dto;
  }
}
