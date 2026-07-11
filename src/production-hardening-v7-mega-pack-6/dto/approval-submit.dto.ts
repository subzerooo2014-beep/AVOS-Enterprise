import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Max,
  Min,
} from "class-validator";

export class ApprovalSubmitDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  approvers!: string[];

  @IsInt()
  @Min(1)
  @Max(100)
  minimumApprovals!: number;
}
