import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyCompilerService{
  compile(model:any){
    return { compiled:true, model };
  }
}
