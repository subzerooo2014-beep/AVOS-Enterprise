export declare class CreateCollaborationSessionDto {
    name: string;
    objective: string;
    coordinatorAgentId: string;
    participantAgentIds: string[];
    sharedContext?: Record<string, unknown>;
}
