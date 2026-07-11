import { IsOptional, IsString } from "class-validator";

export class CreateApikeysDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
