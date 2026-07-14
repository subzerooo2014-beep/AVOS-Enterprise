import { Injectable } from "@nestjs/common"; @Injectable() export class RealtimeGatewayRuntime { broadcast(channel:string,payload:Record<string,unknown>){ return {channel,payload,delivered:true}; } }
