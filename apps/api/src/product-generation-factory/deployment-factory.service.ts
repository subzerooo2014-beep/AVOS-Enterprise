import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { ProductGenerationStore } from './product-generation.store';
import { FilesystemWriterService } from './filesystem-writer.service';

@Injectable()
export class DeploymentFactoryService {
  constructor(
    private readonly store: ProductGenerationStore,
    private readonly writer: FilesystemWriterService,
  ) {}

  async generate(namespace: string, outputRoot: string): Promise<string[]> {
    const manifest = this.store.manifests.get(namespace);
    if (!manifest) throw new BadRequestException(`Manifest not found: ${namespace}`);

    const root = join(outputRoot, namespace);
    const files = [
      await this.writer.write(
        root,
        'backend/Dockerfile',
        `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3100
CMD ["npm", "run", "start"]
`,
      ),
      await this.writer.write(
        root,
        'frontend/Dockerfile',
        `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
`,
      ),
      await this.writer.write(
        root,
        'docker-compose.yml',
        `services:
  database:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: generated_product
    ports:
      - "5432:5432"
  api:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:postgres@database:5432/generated_product
      PORT: 3100
    ports:
      - "3100:3100"
    depends_on:
      - database
  web:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3100/api
    ports:
      - "3200:3000"
    depends_on:
      - api
`,
      ),
      await this.writer.write(
        root,
        '.github/workflows/ci.yml',
        `name: Generated Product CI
on:
  push:
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        directory: [backend, frontend]
    defaults:
      run:
        working-directory: \${{ matrix.directory }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
`,
      ),
      await this.writer.write(
        root,
        'deployment/rollback.md',
        `# Rollback Plan

1. Stop the current generated deployment.
2. Restore the previous immutable image.
3. Restore the previous database backup if migration rollback is required.
4. Validate health, audit, and compliance gates.
5. Record human approval.
`,
      ),
    ];

    manifest.deploymentFiles.push(...files);
    return files;
  }
}