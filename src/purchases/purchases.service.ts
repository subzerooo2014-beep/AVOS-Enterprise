import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any).purchase?.findMany?.() ?? [];
  }

  create(dto: any) {
    return (this.prisma as any).purchase?.create?.({ data: dto }) ?? dto;
  }
}
