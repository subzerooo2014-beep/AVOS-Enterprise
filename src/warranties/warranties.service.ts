import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WarrantiesService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["warranties"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["warranties"]?.create?.({data:dto}) ?? dto;
 }

}
