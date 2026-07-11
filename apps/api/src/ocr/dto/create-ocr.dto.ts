import { IsOptional, IsString } from "class-validator";

export class CreateOcrDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
