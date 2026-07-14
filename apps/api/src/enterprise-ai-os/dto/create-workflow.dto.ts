export class CreateWorkflowDto { name!: string; trigger!: string; steps!: Array<Record<string, unknown>>; }
