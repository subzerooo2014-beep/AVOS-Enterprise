import { Injectable } from "@nestjs/common"; @Injectable() export class IntentDetectionEngine { detect(text:string){return {intent:/buy|price|car/i.test(text)?"SALES":"SUPPORT",confidence:80};} }
