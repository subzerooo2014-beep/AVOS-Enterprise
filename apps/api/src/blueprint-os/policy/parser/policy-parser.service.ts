import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyParserService{
  parse(source:string){
    return { parsed:true, source };
  }
}
