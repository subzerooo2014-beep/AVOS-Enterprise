import { AuditSeverity } from "../enums/audit-severity.enum";

export interface RuntimePolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  methods: string[];
  pathPrefixes: string[];
  requireApprovalToken: boolean;
  blockInProduction: boolean;
  severity: AuditSeverity;
  createdAt: string;
  updatedAt: string;
}
