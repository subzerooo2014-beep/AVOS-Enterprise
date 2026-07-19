import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerationValidatorService{
  validate(input?:any){
    return {
      success:true,
      component:"GenerationValidatorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
