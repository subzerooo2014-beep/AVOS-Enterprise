import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { ProductGenerationStore } from './product-generation.store';
import { FilesystemWriterService } from './filesystem-writer.service';

@Injectable()
export class DatabaseApiCompilerService {
  constructor(
    private readonly store: ProductGenerationStore,
    private readonly writer: FilesystemWriterService,
  ) {}

  async compile(namespace: string, outputRoot: string): Promise<string[]> {
    const architecture = this.store.architectures.get(namespace);
    if (!architecture) {
      throw new BadRequestException(`Architecture not found: ${namespace}`);
    }

    const root = join(outputRoot, namespace, 'backend');
    const models = architecture.entities
      .map((entity) => {
        const fields = entity.fields
          .map((field) => `  ${field.name} ${field.type}${field.required ? '' : '?'}`)
          .join('\n');
        return `model ${entity.name} {
  id        String   @id @default(cuid())
${fields}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`;
      })
      .join('\n\n');

    const schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

${models}
`;

    const files = [
      await this.writer.write(root, 'prisma/schema.prisma', schema),
      await this.writer.write(
        root,
        '.env.example',
        'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/generated_product"\nPORT=3100\n',
      ),
      await this.writer.write(
        root,
        'src/openapi.generated.json',
        JSON.stringify(
          {
            openapi: '3.0.3',
            info: { title: `${namespace} Generated API`, version: '1.0.0' },
            paths: Object.fromEntries(
              architecture.apiResources.map((resource) => [
                `/api/${resource}`,
                {
                  get: { summary: `List ${resource}`, responses: { '200': { description: 'OK' } } },
                  post: { summary: `Create ${resource}`, responses: { '201': { description: 'Created' } } },
                },
              ]),
            ),
          },
          null,
          2,
        ),
      ),
    ];

    return files;
  }
}