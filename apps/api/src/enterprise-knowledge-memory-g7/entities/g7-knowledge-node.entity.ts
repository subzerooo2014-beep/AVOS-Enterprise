export interface G7KnowledgeNode {
  id: string;
  nodeType: string;
  title: string;
  content?: Record<string, unknown>;
  active: boolean;
}