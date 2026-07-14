import { Injectable } from "@nestjs/common"; @Injectable() export class LifecyclePolicy { validate(odometer:number){ if(odometer<0) throw new Error("Invalid odometer"); return true; } }
