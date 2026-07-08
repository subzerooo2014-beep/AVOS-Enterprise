import { IsOptional, IsString } from 'class-validator';

export class SignContractDto {
  @IsOptional()
  @IsString()
  signedBy?: string;

  @IsOptional()
  @IsString()
  signatureReference?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
