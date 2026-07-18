export interface GenerationJob {
  id: string;
  planId: string;
  generator: string;
  status: "pending"|"running"|"completed"|"failed";
}

export interface GenerationEngineStatus {
  healthy: true;
  component: "Factory Generation Engine";
  orchestratesGenerators: true;
}
