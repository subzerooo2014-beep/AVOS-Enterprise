import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReturnsService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["returns"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["returns"]?.create?.({data:dto}) ?? dto;
 }

}
