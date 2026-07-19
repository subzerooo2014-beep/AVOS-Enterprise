import { Injectable } from "@nestjs/common";

@Injectable()
export class DependencyEngineService{
 analyse(){
   return {
     cycles:0,
     unresolved:0,
     healthy:true
   };
 }
}
