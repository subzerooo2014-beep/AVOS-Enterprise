import { Injectable } from "@nestjs/common"; @Injectable() export class Customer360Engine { build(input:Record<string,unknown>){return {profile:input,completeness:Object.keys(input).length*10};} }
