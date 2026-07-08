import { IsOptional, IsString } from "class-validator";

export class CreateEmbeddingsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
