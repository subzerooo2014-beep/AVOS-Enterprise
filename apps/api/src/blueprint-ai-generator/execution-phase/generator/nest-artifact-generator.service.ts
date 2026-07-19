import { Injectable } from "@nestjs/common";

@Injectable()
export class NestArtifactGeneratorService{
  generate(name:string){
    const base=name.toLowerCase().replace(/\s+/g,"-");
    return {
      target:`src/generated/${base}`,
      files:[
        `${base}.module.ts`,
        `${base}.service.ts`,
        `${base}.controller.ts`,
        `${base}.entity.ts`,
        `${base}.dto.ts`
      ]
    };
  }
}
