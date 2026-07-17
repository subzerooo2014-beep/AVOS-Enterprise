import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgeSyncEventService { private readonly events:Array<Record<string,unknown>>=[]; publish(type:string,payload:Record<string,unknown>){ const event={type,payload,occurredAt:new Date().toISOString()}; this.events.push(event); return event; } list(){return [...this.events];} count(){return this.events.length;} }