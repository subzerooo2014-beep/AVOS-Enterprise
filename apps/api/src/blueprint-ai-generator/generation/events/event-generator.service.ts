import { Injectable } from "@nestjs/common";

@Injectable()
export class EventGeneratorService{
  generate(input?:any){
    return {
      success:true,
      component:"EventGeneratorService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
