import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaModelGeneratorService {
  generate(name: string): string {
    const modelName = name.replace(/[^a-zA-Z0-9]/g, "");
    return `model ${modelName} {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([createdAt])
}
`;
  }
}
