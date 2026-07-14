import { Injectable } from "@nestjs/common"; @Injectable() export class RuntimeTenantPolicy { validate(id:string,name:string){ if(!id||!name) throw new Error("Invalid tenant"); return true; } }
