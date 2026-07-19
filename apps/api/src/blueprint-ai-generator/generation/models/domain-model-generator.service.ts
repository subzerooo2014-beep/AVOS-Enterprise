import { Injectable } from "@nestjs/common";

@Injectable()
export class DomainModelGeneratorService{
  generate(input?:any){
    return {
      success:true,
      component:"DomainModelGeneratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
