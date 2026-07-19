import { Injectable } from "@nestjs/common";

@Injectable()
export class DuplicateDetectionEngineService {
  summarize(files: readonly string[]) {
    const names = files.map((file) => file.split("/").pop() ?? file);
    const duplicates = names.filter(
      (name, index) => names.indexOf(name) !== index,
    );

    return {
      filesAnalyzed: files.length,
      duplicateNames: [...new Set(duplicates)],
      duplicateCount: new Set(duplicates).size,
    };
  }
}
