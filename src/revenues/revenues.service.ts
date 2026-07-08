import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RevenuesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["revenues"]?.findMany?.() ?? [];
  }

  create(dto: any) {
    return (this.prisma as any)["revenues"]?.create?.({ data: dto }) ?? dto;
  }
}
