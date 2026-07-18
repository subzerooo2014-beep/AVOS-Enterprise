import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";

@Injectable()
export class FileSystemEngine {

    createDirectory(directory: string): void {

        if (!fs.existsSync(directory)) {

            fs.mkdirSync(directory, {
                recursive: true,
            });

        }

    }

    writeFile(filePath: string, content: string): void {

        this.createDirectory(path.dirname(filePath));

        fs.writeFileSync(
            filePath,
            content,
            "utf8",
        );

    }

    exists(filePath: string): boolean {

        return fs.existsSync(filePath);

    }

}
