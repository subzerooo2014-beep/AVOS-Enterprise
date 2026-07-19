import {
  AvosDocumentCategory,
  AvosDocumentStatus,
} from "../interfaces/documentation.types";

export class CreateDocumentationRecordDto {
  id?: string;
  title!: string;
  version?: string;
  status?: AvosDocumentStatus;
  category!: AvosDocumentCategory;
  classification?: string;
  authority?: string;
  owner!: string;
  approver?: string;
  appliesTo?: string[];
  dependsOn?: string[];
  relatedDocuments?: string[];
  filePath?: string;
  checksum?: string;
  metadata?: Record<string, unknown>;
}
