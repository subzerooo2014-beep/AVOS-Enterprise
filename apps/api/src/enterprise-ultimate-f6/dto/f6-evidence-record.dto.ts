export class CreateF6EvidenceRecordDto {
  id!: string;
  type!: string;
  path!: string;
  verified!: boolean;
}

export class UpdateF6EvidenceRecordDto {
  id?: string;
  type?: string;
  path?: string;
  verified?: boolean;
}