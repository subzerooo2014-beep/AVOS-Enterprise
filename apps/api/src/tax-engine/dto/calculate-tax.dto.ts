import { IsNumber } from "class-validator";

export class CalculateTaxDto {

 @IsNumber()
 amount!:number;

 @IsNumber()
 percentage!:number;

}
