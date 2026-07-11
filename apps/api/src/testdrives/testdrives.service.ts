import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TestdrivesService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["testdrives"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["testdrives"]?.create?.({data:dto}) ?? dto;
 }

}
