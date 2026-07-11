import { IsNumber, IsString } from "class-validator";

export class UpdateCustomerStageDto {

  @IsString()
  customerId!: string;

  @IsString()
  stage!: string;

  @IsNumber()
  score!: number;

}
