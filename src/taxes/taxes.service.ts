import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TaxesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["taxes"]?.findMany?.() ?? [];
  }

  create(dto: any) {
    return (this.prisma as any)["taxes"]?.create?.({ data: dto }) ?? dto;
  }
}
