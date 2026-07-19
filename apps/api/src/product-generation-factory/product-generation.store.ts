import { Injectable } from '@nestjs/common';
import {
  ArchitectureBlueprint,
  GeneratedProductManifest,
  ProductSpecification,
  RepairResult,
  RuntimeCertification,
} from './product-generation.types';

@Injectable()
export class ProductGenerationStore {
  readonly specifications = new Map<string, ProductSpecification>();
  readonly architectures = new Map<string, ArchitectureBlueprint>();
  readonly manifests = new Map<string, GeneratedProductManifest>();
  readonly repairs = new Map<string, RepairResult>();
  readonly certifications = new Map<string, RuntimeCertification>();
}