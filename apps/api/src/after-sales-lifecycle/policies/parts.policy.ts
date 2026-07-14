import { Injectable } from "@nestjs/common"; @Injectable() export class PartsPolicy { validate(stock:number,cost:number){ if(stock<0||cost<=0) throw new Error("Invalid part data"); return true; } }
