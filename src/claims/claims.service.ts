import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClaimsService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["claims"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["claims"]?.create?.({data:dto}) ?? dto;
 }

}
