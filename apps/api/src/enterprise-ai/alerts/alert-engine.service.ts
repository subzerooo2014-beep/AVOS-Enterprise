import { Injectable } from "@nestjs/common";

@Injectable()
export class AlertEngineService {
  generate(input:any){
    return {
      alerts:[],
      severity:"LOW",
      input,
    };
  }
}
