import { IsOptional, IsString } from 'class-validator';

export class ApproveQuoteDto {
  @IsOptional()
  @IsString()
  approvalNote?: string;
}
