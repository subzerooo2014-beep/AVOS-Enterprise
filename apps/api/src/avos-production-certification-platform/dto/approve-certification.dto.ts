import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveCertificationDto {
  @IsString()
  @IsNotEmpty()
  platformId!: string;

  @IsString()
  @IsNotEmpty()
  approvedBy!: string;
}
