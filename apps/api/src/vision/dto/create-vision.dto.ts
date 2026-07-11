import { IsOptional, IsString } from "class-validator";

export class CreateVisionDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
