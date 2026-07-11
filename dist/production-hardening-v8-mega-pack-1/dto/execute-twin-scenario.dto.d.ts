export declare class ExecuteTwinScenarioDto {
    name: string;
    scenarioType: "traffic_spike" | "node_failure" | "region_failure" | "capacity_reduction" | "latency_increase" | "error_increase";
    input: Record<string, number>;
}
