export interface G6IncidentRecord {
  id: string;
  incidentType: string;
  status: string;
  openedAt: string;
  closedAt?: string;
}