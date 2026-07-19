import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";

@Injectable()
export class TypeScriptFileWriterService{

  writeModule(project:string){

    const folder = path.join(process.cwd(),"src","generated",project);

    fs.mkdirSync(folder,{recursive:true});

    fs.writeFileSync(
      path.join(folder, project + ".module.ts"),
`import { Module } from "@nestjs/common";

@Module({})
export class ${project}Module {}
`
    );

    return {
      generated:true,
      folder,
      files:[
        project + ".module.ts"
      ]
    };
  }
}
