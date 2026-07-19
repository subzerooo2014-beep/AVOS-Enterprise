import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintGeneratorService{
  generate(input?:any){
    return {
      success:true,
      service:"BlueprintGeneratorService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
