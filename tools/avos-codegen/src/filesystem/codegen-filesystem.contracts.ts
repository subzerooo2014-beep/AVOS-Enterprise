export enum CodeGenWriteMode {
  CREATE = "create",
  OVERWRITE = "overwrite",
  MERGE = "merge",
  SKIP = "skip",
}

export interface CodeGenFileDescriptor {
  absolutePath: string;
  relativePath: string;
  exists: boolean;
  sizeBytes: number;
  extension: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CodeGenWriteFileInput {
  absolutePath: string;
  content: string;
  mode: CodeGenWriteMode;
  encoding?: BufferEncoding;
}

export interface CodeGenWriteFileResult {
  absolutePath: string;
  mode: CodeGenWriteMode;
  written: boolean;
  skipped: boolean;
  bytes: number;
  createdAt: string;
}
