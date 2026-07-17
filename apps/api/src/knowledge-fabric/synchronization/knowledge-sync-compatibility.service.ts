import { Injectable } from "@nestjs/common";
import { KnowledgeSyncEndpoint } from "./knowledge-synchronization.types";
@Injectable()
export class KnowledgeSyncCompatibilityService { evaluate(source:KnowledgeSyncEndpoint,target:KnowledgeSyncEndpoint){ const sameNamespace=source.namespace===target.namespace; const compatible=sameNamespace&&source.nodeId!==target.nodeId; return {compatible,sameNamespace,distinctNodes:source.nodeId!==target.nodeId,checkedAt:new Date().toISOString()}; } }