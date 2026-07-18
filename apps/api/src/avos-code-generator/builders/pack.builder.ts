import { Injectable, Logger } from "@nestjs/common";
import { BlueprintDefinition } from "../core/blueprint.engine";

@Injectable()
export class PackBuilder {

    private readonly logger = new Logger(PackBuilder.name);

    async build(
        blueprint: BlueprintDefinition,
        output: string,
    ): Promise<void> {

        this.logger.log(
            `Building pack "${blueprint.name}" into "${output}"`,
        );

        // سيتم استدعاء بقية الـ Builders هنا لاحقًا
        // ModuleBuilder
        // ServiceBuilder
        // ControllerBuilder
        // DtoBuilder
        // ContractBuilder
        // TestBuilder

    }

}
