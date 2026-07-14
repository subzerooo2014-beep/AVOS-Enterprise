export type LanguageStatus = "DRAFT" | "ACTIVE" | "DEPRECATED" | "ARCHIVED";
export type TextDirection = "LTR" | "RTL";

export interface LanguagePackRecord {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: TextDirection;
  version: string;
  status: LanguageStatus;
  regionCodes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TranslationMemoryRecord {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translatedText: string;
  domain?: string;
  qualityScore: number;
  createdAt: string;
}
