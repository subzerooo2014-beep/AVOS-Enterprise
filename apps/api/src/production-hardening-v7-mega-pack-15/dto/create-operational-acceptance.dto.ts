export class CreateOperationalAcceptanceDto {
  operationsOwner!: string;
  serviceOwner!: string;
  supportModelValidated?: boolean;
  monitoringValidated?: boolean;
  incidentResponseValidated?: boolean;
  backupRecoveryValidated?: boolean;
  runbooksValidated?: boolean;
}
