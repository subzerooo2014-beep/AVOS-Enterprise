import { IsOptional, IsString } from "class-validator";

export class CreateWorkflowsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
