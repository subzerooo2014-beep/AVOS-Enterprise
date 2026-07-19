import { Injectable } from "@nestjs/common";

@Injectable()
export class UIBlueprintGeneratorService{
  generate(input?:any){
    return {
      success:true,
      component:"UIBlueprintGeneratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
