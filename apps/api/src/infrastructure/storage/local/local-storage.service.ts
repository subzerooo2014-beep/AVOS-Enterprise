import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";

@Injectable()
export class LocalStorageService {
  private root = path.join(process.cwd(), "storage");

  async write(filename: string, content: string) {
    await fs.mkdir(this.root, { recursive: true });
    const filePath = path.join(this.root, filename);
    await fs.writeFile(filePath, content, "utf8");
    return { filePath };
  }
}
