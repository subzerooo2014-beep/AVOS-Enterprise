import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HrService{
 constructor(private prisma:PrismaService){}
 findAll(){ return (this.prisma as any)["hr"]?.findMany?.() ?? []; }
 create(dto:any){ return (this.prisma as any)["hr"]?.create?.({data:dto}) ?? dto; }
}
