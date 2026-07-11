import { IsOptional, IsString } from "class-validator";

export class CreateAiagentsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
