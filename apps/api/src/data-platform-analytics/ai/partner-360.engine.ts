import { Injectable } from "@nestjs/common"; @Injectable() export class Partner360Engine { build(input:Record<string,unknown>){return {partner:input,trustScore:80};} }
