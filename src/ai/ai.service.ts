import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiService{
 constructor(private prisma:PrismaService){}
 findAll(){ return (this.prisma as any)["ai"]?.findMany?.() ?? []; }
 create(dto:any){ return (this.prisma as any)["ai"]?.create?.({data:dto}) ?? dto; }
}
