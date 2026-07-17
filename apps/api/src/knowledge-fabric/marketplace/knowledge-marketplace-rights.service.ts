import { Injectable } from "@nestjs/common";
import { KnowledgeMarketplaceLicense } from "./knowledge-marketplace.types";

@Injectable()
export class KnowledgeMarketplaceRightsService {
  permits(license: KnowledgeMarketplaceLicense, right: string): boolean {
    return license.active && license.rights.includes(right) && !license.restrictions.includes(`DENY_${right}`);
  }
}