import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class QuotelinesService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["quotelines"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["quotelines"]?.create?.({data:dto}) ?? dto;
 }

}
