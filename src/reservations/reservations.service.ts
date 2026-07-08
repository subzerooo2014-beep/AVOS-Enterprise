import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}
  findAll(){ return (this.prisma as any).reservation?.findMany?.() ?? []; }
  create(dto:any){ return (this.prisma as any).reservation?.create?.({data:dto}) ?? dto; }
}
