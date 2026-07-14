export type ConversationStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type CommunicationChannel = "CHAT" | "VOICE" | "VIDEO" | "EMAIL" | "SMS" | "PUSH" | "WHATSAPP" | "SOCIAL";

export interface ConversationRecord {
  id: string;
  customerId: string;
  channel: CommunicationChannel;
  subject: string;
  status: ConversationStatus;
  assignedAgentId?: string;
  createdAt: string;
  updatedAt: string;
}
