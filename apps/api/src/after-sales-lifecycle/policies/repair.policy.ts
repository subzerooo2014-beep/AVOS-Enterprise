import { Injectable } from "@nestjs/common"; @Injectable() export class RepairPolicy { validate(cost:number){ if(cost<=0) throw new Error("Invalid repair cost"); return true; } }
