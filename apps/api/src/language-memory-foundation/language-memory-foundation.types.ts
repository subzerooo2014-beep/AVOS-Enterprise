export type DialectCode =
  | "ar-AE" | "ar-SA" | "ar-KW" | "ar-BH" | "ar-OM" | "ar-QA"
  | "ar-IQ" | "ar-EG" | "ar-LEV" | "ar-MAG" | "en-US" | "en-GB";

export type MemoryType = "SHORT_TERM" | "LONG_TERM" | "EPISODIC" | "SEMANTIC" | "PROCEDURAL";

export interface DialectProfile {
  id: string;
  code: DialectCode;
  languageCode: string;
  region: string;
  lexicon: Record<string, string>;
  createdAt: string;
}

export interface EnterpriseMemoryRecord {
  id: string;
  ownerId: string;
  type: MemoryType;
  content: Record<string, unknown>;
  score: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}
