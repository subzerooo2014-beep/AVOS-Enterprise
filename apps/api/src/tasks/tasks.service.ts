import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TasksService{
 constructor(private prisma:PrismaService){}
 findAll(){ return (this.prisma as any)["tasks"]?.findMany?.() ?? []; }
 create(dto:any){ return (this.prisma as any)["tasks"]?.create?.({data:dto}) ?? dto; }
}
