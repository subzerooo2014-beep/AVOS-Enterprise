import { Injectable } from "@nestjs/common";
import { KnowledgeConflictStrategy } from "./knowledge-synchronization.types";
@Injectable()
export class KnowledgeSyncMergeService { merge(source:Record<string,unknown>,target:Record<string,unknown>,strategy:KnowledgeConflictStrategy){ const merged=strategy==="TARGET_WINS"?{...source,...target}:{...target,...source}; return {strategy,merged,fields:Object.keys(merged).length,mergedAt:new Date().toISOString()}; } }