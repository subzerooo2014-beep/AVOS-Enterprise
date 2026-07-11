import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["expenses"]?.findMany?.() ?? [];
  }

  create(dto: any) {
    return (this.prisma as any)["expenses"]?.create?.({ data: dto }) ?? dto;
  }
}
