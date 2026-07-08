import { IsOptional, IsString } from "class-validator";

export class CreateWebhooksDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
