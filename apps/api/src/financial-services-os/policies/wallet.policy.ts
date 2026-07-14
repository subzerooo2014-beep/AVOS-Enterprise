import { Injectable } from "@nestjs/common"; @Injectable() export class WalletPolicy { validateAmount(amount:number){ if(amount<=0) throw new Error("Invalid wallet amount"); return true; } }
