export declare class CreateIncidentActionDto {
    title: string;
    description: string;
    owner: string;
    priority: number;
    dueAt?: string;
    dependencies?: string[];
    evidenceReferences?: string[];
}
