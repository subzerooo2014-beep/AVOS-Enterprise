import { Injectable } from "@nestjs/common";
import { EnterpriseLanguageService } from "./enterprise-language.service";

@Injectable()
export class SemanticEngineService {
  constructor(private readonly language: EnterpriseLanguageService) {}

  normalize(input: string): {
    original: string;
    normalized: string;
    recognizedTerms: Array<{ term: string; canonicalName: string; domain: string }>;
  } {
    const compact = input.replace(/\s+/g, " ").trim();
    const recognizedTerms = this.language
      .list()
      .filter((term) => compact.toLowerCase().includes(term.term.toLowerCase()))
      .map((term) => ({
        term: term.term,
        canonicalName: term.canonicalName,
        domain: term.domain,
      }));
    return {
      original: input,
      normalized: compact,
      recognizedTerms,
    };
  }

  compare(left: string, right: string): {
    equivalent: boolean;
    leftCanonical?: string;
    rightCanonical?: string;
  } {
    const l = this.language.resolve(left);
    const r = this.language.resolve(right);
    return {
      equivalent: Boolean(l && r && l.canonicalName === r.canonicalName),
      leftCanonical: l?.canonicalName,
      rightCanonical: r?.canonicalName,
    };
  }
}