import { IsNumber, IsOptional, IsString } from "class-validator";

export class CalculatePriceDto {

 @IsString()
 itemId!:string;

 @IsNumber()
 basePrice!:number;

 @IsOptional()
 @IsString()
 customerType?:string;

}
