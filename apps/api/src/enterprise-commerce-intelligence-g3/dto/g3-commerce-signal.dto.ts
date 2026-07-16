export class CreateG3CommerceSignalDto {
  id!: string;
  marketCode!: string;
  signalType!: string;
  score!: number;
  metadata?: Record<string, unknown>;
}

export class UpdateG3CommerceSignalDto {
  id?: string;
  marketCode?: string;
  signalType?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}