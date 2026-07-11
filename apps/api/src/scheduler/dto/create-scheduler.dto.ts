import { IsOptional, IsString } from "class-validator";

export class CreateSchedulerDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
