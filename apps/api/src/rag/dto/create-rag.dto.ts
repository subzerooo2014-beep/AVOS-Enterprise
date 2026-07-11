import { IsOptional, IsString } from "class-validator";

export class CreateRagDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
