import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiSpecGeneratorService{
  generate(input?:any){
    return {
      success:true,
      component:"ApiSpecGeneratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
