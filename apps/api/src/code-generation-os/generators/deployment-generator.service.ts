import { Injectable } from "@nestjs/common";

@Injectable()
export class DeploymentGeneratorService {
  generate(name: string): string {
    return `services:
  ${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}:
    build: .
    restart: unless-stopped
`;
  }
}
