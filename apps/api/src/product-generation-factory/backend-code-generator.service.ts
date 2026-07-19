import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { ProductGenerationStore } from './product-generation.store';
import { FilesystemWriterService } from './filesystem-writer.service';

@Injectable()
export class BackendCodeGeneratorService {
  constructor(
    private readonly store: ProductGenerationStore,
    private readonly writer: FilesystemWriterService,
  ) {}

  async generate(namespace: string, outputRoot: string): Promise<string[]> {
    const architecture = this.store.architectures.get(namespace);
    if (!architecture) {
      throw new BadRequestException(`Architecture not found: ${namespace}`);
    }

    const root = join(outputRoot, namespace, 'backend');
    const files: string[] = [];

    files.push(
      await this.writer.write(
        root,
        'package.json',
        JSON.stringify(
          {
            name: `${namespace}-api`,
            private: true,
            scripts: {
              build: 'nest build',
              start: 'nest start',
              'start:dev': 'nest start --watch',
              test: 'jest',
            },
            dependencies: {
              '@nestjs/common': '^11.0.0',
              '@nestjs/core': '^11.0.0',
              '@nestjs/platform-express': '^11.0.0',
              'class-transformer': '^0.5.1',
              'class-validator': '^0.14.2',
              'reflect-metadata': '^0.2.2',
              rxjs: '^7.8.1',
            },
            devDependencies: {
              '@nestjs/cli': '^11.0.0',
              '@nestjs/testing': '^11.0.0',
              '@types/jest': '^29.5.14',
              '@types/node': '^22.0.0',
              jest: '^29.7.0',
              'ts-jest': '^29.2.5',
              typescript: '^5.7.0',
            },
          },
          null,
          2,
        ),
      ),
    );

    files.push(
      await this.writer.write(
        root,
        'tsconfig.json',
        JSON.stringify(
          {
            compilerOptions: {
              module: 'commonjs',
              declaration: true,
              removeComments: true,
              emitDecoratorMetadata: true,
              experimentalDecorators: true,
              allowSyntheticDefaultImports: true,
              target: 'ES2022',
              sourceMap: true,
              outDir: './dist',
              baseUrl: './',
              incremental: true,
              strict: true,
              skipLibCheck: true,
            },
          },
          null,
          2,
        ),
      ),
    );

    files.push(
      await this.writer.write(
        root,
        'nest-cli.json',
        JSON.stringify({ collection: '@nestjs/schematics', sourceRoot: 'src' }, null, 2),
      ),
    );

    files.push(
      await this.writer.write(
        root,
        'src/main.ts',
        `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3100);
}
void bootstrap();
`,
      ),
    );

    const imports = architecture.modules
      .map((moduleName) => `import { ${this.pascal(moduleName)}Module } from './modules/${moduleName}/${moduleName}.module';`)
      .join('\n');
    const moduleNames = architecture.modules
      .map((moduleName) => `${this.pascal(moduleName)}Module`)
      .join(',\n    ');

    files.push(
      await this.writer.write(
        root,
        'src/app.module.ts',
        `import { Module } from '@nestjs/common';
${imports}

@Module({
  imports: [
    ${moduleNames}
  ],
})
export class AppModule {}
`,
      ),
    );

    for (const moduleName of architecture.modules) {
      const className = this.pascal(moduleName);
      files.push(
        await this.writer.write(
          root,
          `src/modules/${moduleName}/${moduleName}.service.ts`,
          `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Service {
  private readonly records: Array<Record<string, unknown>> = [];

  list() {
    return this.records;
  }

  create(input: Record<string, unknown>) {
    const record = {
      id: '${moduleName}:' + Date.now(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }
}
`,
        ),
      );

      files.push(
        await this.writer.write(
          root,
          `src/modules/${moduleName}/${moduleName}.controller.ts`,
          `import { Body, Controller, Get, Post } from '@nestjs/common';
import { ${className}Service } from './${moduleName}.service';

@Controller('${moduleName}')
export class ${className}Controller {
  constructor(private readonly service: ${className}Service) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.service.create(body);
  }
}
`,
        ),
      );

      files.push(
        await this.writer.write(
          root,
          `src/modules/${moduleName}/${moduleName}.module.ts`,
          `import { Module } from '@nestjs/common';
import { ${className}Controller } from './${moduleName}.controller';
import { ${className}Service } from './${moduleName}.service';

@Module({
  controllers: [${className}Controller],
  providers: [${className}Service],
  exports: [${className}Service],
})
export class ${className}Module {}
`,
        ),
      );
    }

    return files;
  }

  private pascal(value: string): string {
    return value
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
}