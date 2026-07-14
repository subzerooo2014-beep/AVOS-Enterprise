import { Injectable } from "@nestjs/common"; @Injectable() export class QueueRuntime { enqueue(job:Record<string,unknown>){ return {...job,queuePosition:1,status:"QUEUED"}; } }
