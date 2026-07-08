import { IsOptional, IsString } from "class-validator";

export class CreateAutomationDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
