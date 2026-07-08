import { IsOptional, IsString } from "class-validator";

export class CreateListingsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
