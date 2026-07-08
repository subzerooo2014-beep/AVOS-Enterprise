import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadStorageService {

  private readonly root = path.join(process.cwd(), "uploads", "vehicles");

  constructor() {
    if (!fs.existsSync(this.root)) {
      fs.mkdirSync(this.root, { recursive: true });
    }
  }

  rootPath() {
    return this.root;
  }

}
