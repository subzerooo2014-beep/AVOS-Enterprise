import { Injectable } from "@nestjs/common"; @Injectable() export class AdminControlService { execute(action:string,target:string){return {action,target,status:"EXECUTED"};} }
