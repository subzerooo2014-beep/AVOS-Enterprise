import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyResolverService{
  resolve(id:string){
    return { resolved:true, id };
  }
}
