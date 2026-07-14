import { Injectable } from "@nestjs/common"; @Injectable() export class RuntimeRateLimitService { allow(key:string,limit:number){return {key,allowed:true,remaining:limit-1};} }
