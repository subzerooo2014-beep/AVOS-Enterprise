import { IsNumber } from "class-validator";

export class ApplyDiscountDto {

 @IsNumber()
 price!:number;

 @IsNumber()
 discount!:number;

}
