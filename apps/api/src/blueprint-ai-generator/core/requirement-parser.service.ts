import { Injectable } from "@nestjs/common";

@Injectable()
export class RequirementParserService{
  parse(input?:any){
    return {
      success:true,
      service:"RequirementParserService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
