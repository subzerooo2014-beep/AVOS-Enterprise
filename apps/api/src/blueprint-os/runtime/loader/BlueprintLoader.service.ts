import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintLoaderService{
 load(blueprint:any){
   return { loaded:true, blueprint };
 }
}
