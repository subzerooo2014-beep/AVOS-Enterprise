import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CodeGenerationDecisionDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsBoolean()
  approved!: boolean;

  @IsString()
  @IsNotEmpty()
  decidedBy!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
