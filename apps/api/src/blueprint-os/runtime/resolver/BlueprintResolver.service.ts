import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintResolverService{
 resolve(bp:any){
   return { resolved:true, dependencies:[] };
 }
}
