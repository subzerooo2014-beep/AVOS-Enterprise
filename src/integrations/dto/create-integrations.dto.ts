import { IsOptional, IsString } from "class-validator";

export class CreateIntegrationsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
