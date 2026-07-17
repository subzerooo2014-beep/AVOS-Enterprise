import { Injectable } from "@nestjs/common";
import { KnowledgeFoundationRepository } from "./knowledge-foundation.repository";
import {
  CreateKnowledgeAssetInput,
  KnowledgeAsset,
} from "./knowledge-foundation.types";

@Injectable()
export class KnowledgeRegistryService {
  constructor(
    private readonly repository: KnowledgeFoundationRepository,
  ) {}

  register(input: CreateKnowledgeAssetInput): KnowledgeAsset {
    return this.repository.create(input);
  }

  list(): KnowledgeAsset[] {
    return this.repository.findAll();
  }

  resolve(idOrKey: string): KnowledgeAsset | undefined {
    return (
      this.repository.findById(idOrKey) ??
      this.repository.findByKey(idOrKey)
    );
  }

  count(): number {
    return this.repository.count();
  }
}