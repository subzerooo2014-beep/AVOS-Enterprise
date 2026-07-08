import { CRM_STATUSES } from "../constants/crm.constants";

export function isValidCrmStatus(status: string): boolean {
  return CRM_STATUSES.includes(status as any);
}

export function isFinalCrmStatus(status: string): boolean {
  return ["WON", "LOST", "INACTIVE"].includes(status);
}

export function isActiveCrmStatus(status: string): boolean {
  return ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY"].includes(status);
}
