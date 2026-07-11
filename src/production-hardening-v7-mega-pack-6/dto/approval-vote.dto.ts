import {
  IsIn,
  IsOptional,
  IsString,
} from "class-validator";

export class ApprovalVoteDto {
  @IsString()
  approver!: string;

  @IsIn(["approved", "rejected"])
  decision!: "approved" | "rejected";

  @IsOptional()
  @IsString()
  comment?: string;
}
