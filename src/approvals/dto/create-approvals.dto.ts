import { IsOptional, IsString } from "class-validator";

export class CreateApprovalsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
