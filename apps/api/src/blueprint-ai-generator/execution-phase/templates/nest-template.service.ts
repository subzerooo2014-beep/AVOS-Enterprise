import { Injectable } from "@nestjs/common";

@Injectable()
export class NestTemplateService{
 module(name:string){
   return `// ${name} module template`;
 }
}
