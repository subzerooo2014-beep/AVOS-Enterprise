import {
  IsIn,
  IsString,
} from "class-validator";

export class AssignIncidentMemberDto {
  @IsString()
  person!: string;

  @IsIn([
    "incident_commander",
    "security_lead",
    "operations_lead",
    "communications_lead",
    "compliance_lead",
    "recovery_lead",
    "observer",
  ])
  role!:
    | "incident_commander"
    | "security_lead"
    | "operations_lead"
    | "communications_lead"
    | "compliance_lead"
    | "recovery_lead"
    | "observer";
}
