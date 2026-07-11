import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReceiptsService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["receipts"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["receipts"]?.create?.({data:dto}) ?? dto;
 }

}
