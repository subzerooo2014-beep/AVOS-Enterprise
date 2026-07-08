import { IsOptional, IsString } from "class-validator";

export class CreatePromptsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
