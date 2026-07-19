import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintSchemaService{
 validate(schema:any){
   return {
     valid:true,
     version:schema?.version ?? "1.0.0",
     checkedAt:new Date().toISOString()
   };
 }
}
