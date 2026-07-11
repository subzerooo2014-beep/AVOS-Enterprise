import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PublishJobsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(vehicleId:string){

    return (this.prisma as any).publishJob.create({

      data:{

        vehicleId,

        status:"pending",

        provider:"internal",

      }

    });

  }

  async all(){

    return (this.prisma as any).publishJob.findMany({

      orderBy:{
        createdAt:"desc",
      }

    });

  }

}
