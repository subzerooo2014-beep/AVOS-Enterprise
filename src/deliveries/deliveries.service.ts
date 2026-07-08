import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DeliveriesService{

 constructor(private prisma:PrismaService){}

 findAll(){
   return (this.prisma as any)["deliveries"]?.findMany?.() ?? [];
 }

 create(dto:any){
   return (this.prisma as any)["deliveries"]?.create?.({data:dto}) ?? dto;
 }

}
