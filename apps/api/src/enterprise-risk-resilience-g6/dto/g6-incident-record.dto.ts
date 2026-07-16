export class CreateG6IncidentRecordDto {
  id!: string;
  incidentType!: string;
  status!: string;
  openedAt!: string;
  closedAt?: string;
}

export class UpdateG6IncidentRecordDto {
  id?: string;
  incidentType?: string;
  status?: string;
  openedAt?: string;
  closedAt?: string;
}