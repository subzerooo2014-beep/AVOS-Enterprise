import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SupportService{
 constructor(private prisma:PrismaService){}
 findAll(){ return (this.prisma as any)["support"]?.findMany?.() ?? []; }
 create(dto:any){ return (this.prisma as any)["support"]?.create?.({data:dto}) ?? dto; }
}
