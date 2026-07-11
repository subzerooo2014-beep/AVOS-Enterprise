import { IsOptional, IsString } from "class-validator";

export class CreateComparisonsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
