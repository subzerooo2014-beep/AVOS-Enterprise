import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";

@Injectable()
export class TemplateRepositoryEngine {

    private readonly cache = new Map<string, string>();

    load(templateName: string): string {

        if (this.cache.has(templateName)) {

            return this.cache.get(templateName)!;

        }

        const templatePath = path.join(
            process.cwd(),
            "src",
            "avos-code-generator",
            "templates",
            templateName,
        );

        if (!fs.existsSync(templatePath)) {

            throw new Error(
                `Template not found: ${templateName}`,
            );

        }

        const content = fs.readFileSync(
            templatePath,
            "utf8",
        );

        this.cache.set(
            templateName,
            content,
        );

        return content;

    }

    exists(templateName: string): boolean {

        const templatePath = path.join(
            process.cwd(),
            "src",
            "avos-code-generator",
            "templates",
            templateName,
        );

        return fs.existsSync(templatePath);

    }

    clearCache(): void {

        this.cache.clear();

    }

}
