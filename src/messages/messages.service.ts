import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MessagesService{
 constructor(private prisma:PrismaService){}
 findAll(){ return (this.prisma as any)["messages"]?.findMany?.() ?? []; }
 create(dto:any){ return (this.prisma as any)["messages"]?.create?.({data:dto}) ?? dto; }
}
