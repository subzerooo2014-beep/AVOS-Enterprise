import { IsString } from "class-validator";

export class ConvertLeadDto {

  @IsString()
  leadId!:string;

  @IsString()
  customerId!:string;

}
