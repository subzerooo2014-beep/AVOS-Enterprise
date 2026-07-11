import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CalendarService{
 constructor(private prisma:PrismaService){}
 findAll(){ return (this.prisma as any)["calendar"]?.findMany?.() ?? []; }
 create(dto:any){ return (this.prisma as any)["calendar"]?.create?.({data:dto}) ?? dto; }
}
