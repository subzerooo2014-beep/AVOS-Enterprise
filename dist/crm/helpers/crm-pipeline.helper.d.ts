export declare const CRM_PIPELINE_STAGES: readonly ["NEW", "CONTACTED", "QUALIFIED", "OPPORTUNITY", "WON", "LOST", "INACTIVE"];
export declare function normalizePipelineStage(status: any): string;
export declare function groupCrmPipeline(items: any[]): Record<string, any[]>;
