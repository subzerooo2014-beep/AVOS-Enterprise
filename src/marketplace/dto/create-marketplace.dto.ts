import { IsOptional, IsString } from "class-validator";

export class CreateMarketplaceDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
