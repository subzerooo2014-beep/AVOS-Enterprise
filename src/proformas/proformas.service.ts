import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProformasService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["proformas"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["proformas"]?.create?.({data:dto}) ?? dto;
 }

}
