export class CreateDocumentationVersionDto {
  version!: string;
  changeSummary!: string;
  changeType!: "patch" | "minor" | "major";
  createdBy!: string;
  metadata?: Record<string, unknown>;
}
