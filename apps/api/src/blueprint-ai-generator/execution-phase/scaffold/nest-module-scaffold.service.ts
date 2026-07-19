import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";

@Injectable()
export class NestModuleScaffoldService{

 generate(project:string){

  const base = path.join(process.cwd(),"src","generated",project);
  fs.mkdirSync(base,{recursive:true});

  const files = {
    module:`import { Module } from "@nestjs/common";

@Module({})
export class ${project}Module {}
`,
    service:`import { Injectable } from "@nestjs/common";

@Injectable()
export class ${project}Service {}
`,
    controller:`import { Controller } from "@nestjs/common";

@Controller("${project.toLowerCase()}")
export class ${project}Controller {}
`,
    entity:`export class ${project}Entity {}`,
    dto:`export class Create${project}Dto {}`
  };

  fs.writeFileSync(path.join(base,project+".module.ts"),files.module);
  fs.writeFileSync(path.join(base,project+".service.ts"),files.service);
  fs.writeFileSync(path.join(base,project+".controller.ts"),files.controller);
  fs.writeFileSync(path.join(base,project+".entity.ts"),files.entity);
  fs.writeFileSync(path.join(base,"create-"+project.toLowerCase()+".dto.ts"),files.dto);

  return {
    generated:true,
    folder:base,
    files:Object.keys(files).length
  };
 }
}
