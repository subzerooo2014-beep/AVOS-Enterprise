import { IsOptional, IsString } from "class-validator";

export class CreateKnowledgeDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
