import { IsOptional, IsString } from "class-validator";

export class CreateAssistantDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
