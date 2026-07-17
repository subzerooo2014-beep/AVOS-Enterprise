import {
  CreateKnowledgeRelationInput,
  KnowledgeRecord,
  KnowledgeRegistrySnapshot,
  RegisterKnowledgeInput,
  UpdateKnowledgeInput,
} from "./knowledge.types";

export const KNOWLEDGE_REGISTRY = Symbol("KNOWLEDGE_REGISTRY");
export const KNOWLEDGE_GRAPH = Symbol("KNOWLEDGE_GRAPH");
export const KNOWLEDGE_VALIDATOR = Symbol("KNOWLEDGE_VALIDATOR");

export interface KnowledgeRegistryContract {
  register(input: RegisterKnowledgeInput): KnowledgeRecord;
  getById(id: string): KnowledgeRecord | undefined;
  getByKey(key: string): KnowledgeRecord | undefined;
  list(): KnowledgeRecord[];
  update(id: string, input: UpdateKnowledgeInput): KnowledgeRecord;
  activate(id: string): KnowledgeRecord;
  deprecate(id: string): KnowledgeRecord;
  archive(id: string): KnowledgeRecord;
  snapshot(): KnowledgeRegistrySnapshot;
}

export interface KnowledgeGraphContract {
  connect(input: CreateKnowledgeRelationInput): KnowledgeRecord;
  dependenciesOf(knowledgeId: string): KnowledgeRecord[];
  dependentsOf(knowledgeId: string): KnowledgeRecord[];
}