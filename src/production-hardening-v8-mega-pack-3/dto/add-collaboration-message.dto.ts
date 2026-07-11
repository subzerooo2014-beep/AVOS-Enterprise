export class AddCollaborationMessageDto {
  fromAgentId!: string;
  toAgentId?: string;
  messageType!:
    | "proposal"
    | "analysis"
    | "challenge"
    | "response"
    | "decision"
    | "evidence";
  content!: string;
  metadata?: Record<string, unknown>;
}
