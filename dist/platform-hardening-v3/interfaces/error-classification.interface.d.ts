import { ErrorCategory } from "../enums/error-category.enum";
import { IncidentSeverity } from "../enums/incident-severity.enum";
export interface ErrorClassification {
    category: ErrorCategory;
    severity: IncidentSeverity;
    statusCode: number;
    retryable: boolean;
    operational: boolean;
}
