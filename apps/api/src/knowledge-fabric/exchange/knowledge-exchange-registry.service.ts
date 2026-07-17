import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeExchangeChannel, KnowledgeExchangeParticipant } from "./knowledge-exchange.types";

@Injectable()
export class KnowledgeExchangeRegistryService {
  private readonly channels = new Map<string, KnowledgeExchangeChannel>();
  private readonly participants = new Map<string, KnowledgeExchangeParticipant>();

  registerChannel(input: Omit<KnowledgeExchangeChannel, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeExchangeChannel {
    const now = new Date().toISOString();
    const channel: KnowledgeExchangeChannel = { ...input, id: randomUUID(), state: "ACTIVE", createdAt: now, updatedAt: now };
    this.channels.set(channel.id, channel);
    return channel;
  }

  registerParticipant(input: Omit<KnowledgeExchangeParticipant, "id" | "state" | "registeredAt" | "updatedAt">): KnowledgeExchangeParticipant {
    this.getDomain(input.channelId);
    const now = new Date().toISOString();
    const participant: KnowledgeExchangeParticipant = { ...input, id: randomUUID(), state: "ACTIVE", registeredAt: now, updatedAt: now };
    this.participants.set(participant.id, participant);
    return participant;
  }

  getDomain(id: string): KnowledgeExchangeChannel {
    const channel = this.channels.get(id);
    if (!channel) throw new NotFoundException("Knowledge exchange channel was not found");
    return channel;
  }

  getParticipant(id: string): KnowledgeExchangeParticipant {
    const participant = this.participants.get(id);
    if (!participant) throw new NotFoundException("Knowledge exchange participant was not found");
    return participant;
  }

  listChannels(): KnowledgeExchangeChannel[] { return [...this.channels.values()]; }
  listParticipants(): KnowledgeExchangeParticipant[] { return [...this.participants.values()]; }
  participantsForChannel(channelId: string): KnowledgeExchangeParticipant[] { return this.listParticipants().filter((participant) => participant.channelId === channelId); }

  updateParticipantState(id: string, state: KnowledgeExchangeParticipant["state"]): KnowledgeExchangeParticipant {
    const participant = this.getParticipant(id);
    participant.state = state;
    participant.updatedAt = new Date().toISOString();
    return participant;
  }

  updateChannelState(id: string, state: KnowledgeExchangeChannel["state"]): KnowledgeExchangeChannel {
    const channel = this.getDomain(id);
    channel.state = state;
    channel.updatedAt = new Date().toISOString();
    return channel;
  }

  counts() { return { channels: this.channels.size, participants: this.participants.size }; }
}