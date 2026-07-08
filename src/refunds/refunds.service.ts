import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RefundsService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["refunds"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["refunds"]?.create?.({data:dto}) ?? dto;
 }

}
