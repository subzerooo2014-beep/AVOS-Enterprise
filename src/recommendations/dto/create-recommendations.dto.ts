import { IsOptional, IsString } from "class-validator";

export class CreateRecommendationsDto{
 @IsOptional()
 @IsString()
 name?:string;

 @IsOptional()
 @IsString()
 description?:string;
}
