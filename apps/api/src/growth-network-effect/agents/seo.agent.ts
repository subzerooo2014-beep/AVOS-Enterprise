import { Injectable } from "@nestjs/common"; @Injectable() export class SeoAgent { execute(keywords:string[]){ return {keywords,recommendations:keywords.map(x=>`Optimize for ${x}`)}; } }
