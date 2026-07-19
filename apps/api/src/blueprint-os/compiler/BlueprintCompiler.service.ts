import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintCompilerService{
 compile(bp:any){
   return {
      success:true,
      blueprint:bp,
      compiledAt:new Date().toISOString()
   };
 }
}
