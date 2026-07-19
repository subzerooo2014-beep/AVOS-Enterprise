import { Injectable } from "@nestjs/common";

@Injectable()
export class DatabaseGeneratorService{
  generate(input?:any){
    return {
      success:true,
      component:"DatabaseGeneratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
