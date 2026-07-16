import { Injectable } from "@nestjs/common";

@Injectable()
export class IntegrationVersionManagerService {
  compare(left: string, right: string): number {
    return left.localeCompare(right, undefined, { numeric: true });
  }

  isCompatible(current: string, required: string): boolean {
    const currentMajor = Number(current.split(".")[0] ?? 0);
    const requiredMajor = Number(required.split(".")[0] ?? 0);
    return currentMajor === requiredMajor;
  }

  latest(versions: string[]): string | undefined {
    return [...versions].sort((a, b) => this.compare(b, a))[0];
  }
}
