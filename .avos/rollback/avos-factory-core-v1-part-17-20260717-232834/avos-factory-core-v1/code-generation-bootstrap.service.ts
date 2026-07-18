import {
  Injectable,
  OnModuleInit
} from "@nestjs/common";
import {
  CodeGenerationProviderRegistryService
} from "./code-generation-provider-registry.service";
import {
  TypeScriptCodeGenerationProvider
} from "./typescript-code-generation.provider";

@Injectable()
export class CodeGenerationBootstrapService
  implements OnModuleInit {
  constructor(
    private readonly registry:
      CodeGenerationProviderRegistryService,
    private readonly typeScriptProvider:
      TypeScriptCodeGenerationProvider
  ) {}

  onModuleInit(): void {
    if (
      !this.registry.has(
        this.typeScriptProvider.id
      )
    ) {
      this.registry.register(
        this.typeScriptProvider
      );
    }
  }
}
