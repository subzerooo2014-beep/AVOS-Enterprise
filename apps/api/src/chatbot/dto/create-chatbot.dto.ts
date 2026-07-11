import { IsOptional, IsString } from "class-validator";

export class CreateChatbotDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
