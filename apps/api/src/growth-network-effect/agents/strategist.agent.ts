import { Injectable } from "@nestjs/common"; @Injectable() export class StrategistAgent { execute(input:Record<string,unknown>){ return {strategy:"growth_plan",input,status:"COMPLETED"}; } }
