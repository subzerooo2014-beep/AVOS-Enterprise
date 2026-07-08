import { IsOptional, IsString } from "class-validator";

export class CreateAuctionsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
