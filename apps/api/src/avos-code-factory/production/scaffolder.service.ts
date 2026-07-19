import { Injectable } from "@nestjs/common";
import {
  FactoryScaffoldDefinition,
} from "../contracts/materialization.contracts";

@Injectable()
export class FactoryProjectScaffolderService {
  getNestJsLibraryScaffold(
    name: string,
    description: string,
  ): FactoryScaffoldDefinition {
    return {
      id: "nestjs-library-scaffold",
      name,
      framework: "nestjs",
      files: [
        {
          path: "package.json",
          type: "package",
          content: JSON.stringify(
            {
              name,
              version: "1.0.0",
              private: true,
              scripts: {
                build: "tsc -p tsconfig.json",
                test: "jest",
              },
              dependencies: {
                "@nestjs/common": "^11.0.0",
                "reflect-metadata": "^0.2.2",
                rxjs: "^7.8.1",
              },
              devDependencies: {
                "@types/jest": "^29.5.14",
                "@types/node": "^22.0.0",
                jest: "^29.7.0",
                "ts-jest": "^29.2.5",
                typescript: "^6.0.0",
              },
            },
            null,
            2,
          ),
        },
        {
          path: "tsconfig.json",
          type: "configuration",
          content: JSON.stringify(
            {
              compilerOptions: {
                target: "ES2022",
                module: "commonjs",
                declaration: true,
                strict: true,
                esModuleInterop: true,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                skipLibCheck: true,
                outDir: "dist",
              },
              include: ["src/**/*.ts"],
            },
            null,
            2,
          ),
        },
        {
          path: "README.md",
          type: "documentation",
          content: `# ${name}\n\n${description}\n`,
        },
      ],
    };
  }
}
