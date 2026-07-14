import { Injectable } from "@nestjs/common"; @Injectable() export class SocialAgent { execute(channels:string[],content:string){ return channels.map(channel=>({channel,content,status:"QUEUED"})); } }
