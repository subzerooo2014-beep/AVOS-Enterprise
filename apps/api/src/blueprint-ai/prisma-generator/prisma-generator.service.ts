import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaGeneratorService{

  health(){
    return {
      module:"prisma-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
