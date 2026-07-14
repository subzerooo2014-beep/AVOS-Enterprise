import { Injectable } from "@nestjs/common"; @Injectable() export class RuntimeSecurityService { evaluate(risk:number){return {risk,decision:risk>=70?"BLOCK":risk>=40?"REVIEW":"ALLOW"};} }
