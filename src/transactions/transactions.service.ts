import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["transactions"]?.findMany?.() ?? [];
  }

  create(dto: any) {
    return (this.prisma as any)["transactions"]?.create?.({ data: dto }) ?? dto;
  }
}
