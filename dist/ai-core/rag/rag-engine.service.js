"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagEngineService = void 0;
const common_1 = require("@nestjs/common");
const embedding_service_1 = require("../embeddings/embedding.service");
const vector_store_service_1 = require("../vectors/vector-store.service");
const knowledge_base_service_1 = require("../knowledge/knowledge-base.service");
let RagEngineService = class RagEngineService {
    constructor(embeddings, vectors, kb) {
        this.embeddings = embeddings;
        this.vectors = vectors;
        this.kb = kb;
    }
    async index(id, text) {
        const emb = await this.embeddings.embed(text);
        this.kb.add({ id, text });
        this.vectors.add(id, emb.vector, { text });
        return {
            indexed: true,
            id
        };
    }
    async retrieve(question) {
        const emb = await this.embeddings.embed(question);
        return {
            question,
            matches: this.vectors.search(emb.vector),
            knowledge: this.kb.all()
        };
    }
};
exports.RagEngineService = RagEngineService;
exports.RagEngineService = RagEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [embedding_service_1.EmbeddingService,
        vector_store_service_1.VectorStoreService,
        knowledge_base_service_1.KnowledgeBaseService])
], RagEngineService);
//# sourceMappingURL=rag-engine.service.js.map