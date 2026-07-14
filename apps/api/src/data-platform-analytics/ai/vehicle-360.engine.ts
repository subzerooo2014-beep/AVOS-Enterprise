import { Injectable } from "@nestjs/common"; @Injectable() export class Vehicle360Engine { build(input:Record<string,unknown>){return {vehicle:input,healthScore:85};} }
