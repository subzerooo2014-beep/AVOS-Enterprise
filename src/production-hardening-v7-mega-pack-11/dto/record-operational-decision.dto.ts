export class RecordOperationalDecisionDto {
  sessionId?: string;
  incidentId?: string;
  decision!:
    | "continue_operations"
    | "monitor"
    | "freeze_changes"
    | "activate_command_center"
    | "escalate_incident"
    | "invoke_recovery"
    | "executive_notification";
  reason!: string;
  decidedBy?: string;
}
