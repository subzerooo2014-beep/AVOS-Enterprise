import { EmbeddingService } from "../embeddings/embedding.service";
import { VectorStoreService } from "../vectors/vector-store.service";
import { KnowledgeBaseService } from "../knowledge/knowledge-base.service";
export declare class RagEngineService {
    private embeddings;
    private vectors;
    private kb;
    constructor(embeddings: EmbeddingService, vectors: VectorStoreService, kb: KnowledgeBaseService);
    index(id: string, text: string): Promise<{
        indexed: boolean;
        id: string;
    }>;
    retrieve(question: string): Promise<{
        question: string;
        matches: any[];
        knowledge: any[];
    }>;
}
