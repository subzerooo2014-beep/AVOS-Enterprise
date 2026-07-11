import {
  IsObject,
  IsString,
} from "class-validator";

export class CompareBaselineDto {
  @IsString()
  targetType!: string;

  @IsString()
  targetId!: string;

  @IsObject()
  observedState!: Record<string, unknown>;
}
