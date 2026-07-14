import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintDependencyResolverRuntime {
  execute(input: Record<string, unknown>) {
    return {
      id: "blueprint-dependency-resolver_"+Date.now(),
      input,
      status: "COMPLETED",
    };
  }
}
