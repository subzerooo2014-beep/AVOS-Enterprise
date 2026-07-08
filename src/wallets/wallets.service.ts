import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any)["wallets"]?.findMany?.() ?? [];
  }

  create(dto: any) {
    return (this.prisma as any)["wallets"]?.create?.({ data: dto }) ?? dto;
  }
}
