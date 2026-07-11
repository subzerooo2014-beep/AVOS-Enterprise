import { IsOptional, IsString } from "class-validator";

export class CreateAlertsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
