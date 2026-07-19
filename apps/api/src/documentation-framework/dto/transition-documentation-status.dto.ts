import { AvosDocumentStatus } from "../interfaces/documentation.types";

export class TransitionDocumentationStatusDto {
  nextStatus!: AvosDocumentStatus;
  actor!: string;
  reason?: string;
}
