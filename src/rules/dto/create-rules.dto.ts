import { IsOptional, IsString } from "class-validator";

export class CreateRulesDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
