import type { {{TypeName}} } from "../types";

export async function fetch{{ApiName}}(): Promise<{{TypeName}}[]> {
  return [
    {
      id: "1",
      title: "{{Title}}",
      description: "{{Description}}",
    },
  ];
}