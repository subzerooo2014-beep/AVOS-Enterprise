import { IsOptional, IsString } from "class-validator";

export class CreateEventsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
