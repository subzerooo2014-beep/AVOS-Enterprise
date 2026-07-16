import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseBrainMegaPack2Service } from "./enterprise-brain-mega-pack-2.service";
import { BrainKnowledgeGraphService } from "./knowledge/brain-knowledge-graph.service";
import { BrainOntologyRegistryService } from "./ontology/brain-ontology-registry.service";
import { BrainSemanticIndexService } from "./semantic/brain-semantic-index.service";
import { BrainMemoryStoreService } from "./memory/brain-memory-store.service";
import { BrainMemoryRetrievalService } from "./retrieval/brain-memory-retrieval.service";
import { BrainMemoryConsolidationService } from "./consolidation/brain-memory-consolidation.service";
import { BrainKnowledgeValidationService } from "./validation/brain-knowledge-validation.service";
import { BrainKnowledgeMemoryHealthService } from "./health/brain-knowledge-memory-health.service";
import { BrainKnowledgeAuditService } from "./observability/brain-knowledge-audit.service";
import {
  BrainKnowledgeNode,
  BrainKnowledgeRelation,
  BrainMemoryRecord,
  BrainOntology
} from "./enterprise-brain-mega-pack-2.types";

@Controller("enterprise-brain-v2")
export class EnterpriseBrainMegaPack2Controller {
  constructor(
    private readonly pack: EnterpriseBrainMegaPack2Service,
    private readonly graph: BrainKnowledgeGraphService,
    private readonly ontologies: BrainOntologyRegistryService,
    private readonly semanticIndex: BrainSemanticIndexService,
    private readonly memory: BrainMemoryStoreService,
    private readonly retrieval: BrainMemoryRetrievalService,
    private readonly consolidation: BrainMemoryConsolidationService,
    private readonly validation: BrainKnowledgeValidationService,
    private readonly health: BrainKnowledgeMemoryHealthService,
    private readonly audit: BrainKnowledgeAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("knowledge/nodes")
  knowledgeNodes() {
    return {
      summary: this.graph.summary(),
      items: this.graph.listNodes()
    };
  }

  @Post("knowledge/nodes")
  createKnowledgeNode(
    @Body()
    body: {
      node: Omit<BrainKnowledgeNode, "createdAt" | "updatedAt">;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.graph.createNode(
      body.node,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("knowledge/relations")
  knowledgeRelations() {
    return {
      summary: this.graph.summary(),
      items: this.graph.listRelations()
    };
  }

  @Post("knowledge/relations")
  createKnowledgeRelation(
    @Body()
    body: {
      relation: Omit<BrainKnowledgeRelation, "createdAt" | "updatedAt">;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.graph.createRelation(
      body.relation,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("knowledge/nodes/:id/neighbors")
  neighbors(@Param("id") id: string) {
    return this.graph.neighbors(id);
  }

  @Get("ontologies")
  ontologyList() {
    return {
      summary: this.ontologies.summary(),
      items: this.ontologies.list()
    };
  }

  @Post("ontologies")
  registerOntology(
    @Body()
    body: {
      ontology: Omit<BrainOntology, "createdAt" | "updatedAt">;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.ontologies.register(
      body.ontology,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("semantic-index/rebuild")
  rebuildIndex(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.semanticIndex.rebuild(body);
  }

  @Post("semantic-search")
  semanticSearch(
    @Body()
    body: {
      query: string;
      limit?: number;
    }
  ) {
    return this.semanticIndex.search(
      body.query,
      body.limit
    );
  }

  @Get("memories")
  memoryList() {
    return {
      summary: this.memory.summary(),
      items: this.memory.list()
    };
  }

  @Post("memories")
  createMemory(
    @Body()
    body: {
      memory: Omit<
        BrainMemoryRecord,
        "id" | "createdAt" | "updatedAt" | "status"
      > & {
        id?: string;
        status?: BrainMemoryRecord["status"];
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.memory.create(
      body.memory,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("memories/:id/archive")
  archiveMemory(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.memory.archive({
      memoryId: id,
      ...body
    });
  }

  @Post("memories/:id/delete")
  deleteMemory(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      humanApproved: boolean;
    }
  ) {
    return this.memory.remove({
      memoryId: id,
      ...body
    });
  }

  @Post("memories/retrieve")
  retrieveMemory(
    @Body()
    body: {
      query: string;
      types?: BrainMemoryRecord["type"][];
      ownerIdentityId?: string;
      sessionId?: string;
      organizationId?: string;
      includeSensitive: boolean;
      limit?: number;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.retrieval.retrieve(body);
  }

  @Post("consolidations")
  planConsolidation(
    @Body()
    body: {
      sourceMemoryIds: string[];
      strategy: "merge" | "summarize" | "promote" | "archive";
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.consolidation.plan(body);
  }

  @Post("consolidations/:id/execute")
  executeConsolidation(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.consolidation.execute({
      consolidationId: id,
      ...body
    });
  }

  @Get("consolidations")
  consolidationList() {
    return {
      summary: this.consolidation.summary(),
      items: this.consolidation.list()
    };
  }

  @Post("validation/run")
  runValidation(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.validation.run(body);
  }

  @Get("validation")
  validationList() {
    return {
      summary: this.validation.summary(),
      items: this.validation.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
