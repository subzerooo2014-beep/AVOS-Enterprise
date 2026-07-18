import { Injectable, OnModuleInit } from "@nestjs/common";

import { ModuleBuilder } from "../builders/module.builder";

export interface GeneratorBuilder {

    readonly capability: string;

    build(
        blueprint: unknown,
        output: string,
    ): Promise<void>;

}

@Injectable()
export class BuilderRegistry implements OnModuleInit {

    private readonly builders =
        new Map<string, GeneratorBuilder>();

    constructor(
        private readonly moduleBuilder: ModuleBuilder,
    ) {}

    onModuleInit(): void {

        this.register(this.moduleBuilder);

    }

    register(builder: GeneratorBuilder): void {

        this.builders.set(
            builder.capability,
            builder,
        );

    }

    get(capability: string): GeneratorBuilder {

        const builder =
            this.builders.get(capability);

        if (!builder) {

            throw new Error(
                `Builder "${capability}" not registered.`,
            );

        }

        return builder;

    }

    list(): GeneratorBuilder[] {

        return [...this.builders.values()];

    }

}
