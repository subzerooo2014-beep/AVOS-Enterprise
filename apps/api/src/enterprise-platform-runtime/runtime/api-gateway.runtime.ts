import { Injectable } from "@nestjs/common"; @Injectable() export class ApiGatewayRuntime { route(path:string,target:string){ return {path,target,status:"ACTIVE"}; } }
