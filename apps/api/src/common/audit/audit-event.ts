export class AuditEvent {
  constructor(
    public action: string,
    public entity: string,
    public entityId?: string,
    public userId?: string,
  ) {}
}
