import { Injectable, Logger } from "@nestjs/common";
import * as path from "node:path";

import { BlueprintDefinition } from "../core/blueprint.engine";
import { TemplateEngine } from "../core/template.engine";
import { TemplateRepositoryEngine } from "../core/template-repository.engine";
import { FileSystemEngine } from "../core/filesystem.engine";
import { GeneratorBuilder } from "../registry/builder.registry";

@Injectable()
export class ModuleBuilder implements GeneratorBuilder {

    readonly capability = "module";

    private readonly logger = new Logger(ModuleBuilder.name);

    constructor(
        private readonly templateRepository: TemplateRepositoryEngine,
        private readonly templateEngine: TemplateEngine,
        private readonly fileSystem: FileSystemEngine,
    ) {}

    async build(
        blueprint: BlueprintDefinition,
        output: string,
    ): Promise<void> {

        const template = this.templateRepository.load("module.tpl");

        const content = this.templateEngine.render(
            template,
            {
                ModuleName: blueprint.name,
            },
        );

        const fileName = `${blueprint.name.toLowerCase()}.module.ts`;

        this.fileSystem.writeFile(
            path.join(output, fileName),
            content,
        );

        this.logger.log(`Generated ${fileName}`);

    }

}
