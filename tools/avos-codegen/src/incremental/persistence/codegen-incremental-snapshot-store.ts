import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
} from "node:path";
import {
  CodeGenIncrementalSnapshot,
} from "../contracts/codegen-incremental.contracts";

export class CodeGenIncrementalSnapshotStore {
  async load(
    snapshotPath: string,
  ): Promise<
    CodeGenIncrementalSnapshot |
    undefined
  > {
    try {
      const content =
        await readFile(
          snapshotPath,
          "utf8",
        );

      return JSON.parse(
        content,
      ) as CodeGenIncrementalSnapshot;
    } catch {
      return undefined;
    }
  }

  async save(
    snapshotPath: string,
    snapshot:
      CodeGenIncrementalSnapshot,
  ): Promise<string> {
    await mkdir(
      dirname(snapshotPath),
      {
        recursive: true,
      },
    );

    await writeFile(
      snapshotPath,
      JSON.stringify(
        snapshot,
        null,
        2,
      ),
      "utf8",
    );

    return snapshotPath;
  }
}
