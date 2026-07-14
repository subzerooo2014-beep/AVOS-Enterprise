import { Injectable } from "@nestjs/common"; @Injectable() export class RoadsidePolicy { validate(issue:string){ if(!issue) throw new Error("Issue required"); return true; } }
