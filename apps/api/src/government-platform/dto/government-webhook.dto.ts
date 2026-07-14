export class GovernmentWebhookDto { provider!: string; eventId!: string; eventType!: string; payload!: Record<string, unknown>; signature!: string; }
