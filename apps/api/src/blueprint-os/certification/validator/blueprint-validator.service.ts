import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintValidatorService{
 validate(){
   return { valid:true, errors:[] };
 }
}
