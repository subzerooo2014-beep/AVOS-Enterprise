# AVOS Refactoring Engine v1

AST-based TypeScript and NestJS refactoring engine.

Supported operations:

- ensureNamedImport
- ensureModuleImport
- ensureModuleProvider
- ensureModuleExport
- ensureModuleController

The engine is idempotent and does not use Regex for source-code mutation.