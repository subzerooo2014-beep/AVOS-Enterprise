import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiGeneratorService{
  generate(input?:any){
    return {
      success:true,
      service:"ApiGeneratorService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
