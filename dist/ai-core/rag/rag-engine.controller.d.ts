import { RagEngineService } from "./rag-engine.service";
export declare class RagEngineController {
    private rag;
    constructor(rag: RagEngineService);
    index(dto: any): Promise<{
        indexed: boolean;
        id: string;
    }>;
    search(dto: any): Promise<{
        question: string;
        matches: any[];
        knowledge: any[];
    }>;
}
