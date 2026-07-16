const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function decoratorsOf(node) {
  if (typeof ts.canHaveDecorators === "function" && ts.canHaveDecorators(node)) {
    return ts.getDecorators(node) || [];
  }
  return node.decorators || [];
}

function main() {
  const sourcePath = process.argv[2];
  const manifestPath = process.argv[3];
  const summaryPath = process.argv[4];

  if (!sourcePath || !manifestPath || !summaryPath) {
    throw new Error("Missing analyzer arguments.");
  }

  const sourceText = fs.readFileSync(sourcePath, "utf8");
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const parseDiagnostics = (sourceFile.parseDiagnostics || []).map((item) => ({
    code: item.code,
    message: ts.flattenDiagnosticMessageText(item.messageText, "\n"),
    start: item.start,
    length: item.length,
  }));

  const imports = [];
  const importedSymbols = new Set();

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;

    const symbols = [];
    const clause = statement.importClause;

    if (clause) {
      if (clause.name) {
        symbols.push(clause.name.text);
        importedSymbols.add(clause.name.text);
      }

      if (clause.namedBindings) {
        if (ts.isNamespaceImport(clause.namedBindings)) {
          symbols.push(clause.namedBindings.name.text);
          importedSymbols.add(clause.namedBindings.name.text);
        } else if (ts.isNamedImports(clause.namedBindings)) {
          for (const element of clause.namedBindings.elements) {
            symbols.push(element.name.text);
            importedSymbols.add(element.name.text);
          }
        }
      }
    }

    imports.push({
      moduleSpecifier: statement.moduleSpecifier.text,
      symbols,
      text: statement.getText(sourceFile),
    });
  }

  let moduleClass = null;
  let moduleImports = [];
  let controllers = [];
  let providers = [];
  let exportsList = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isClassDeclaration(statement) || !statement.name) continue;

    for (const decorator of decoratorsOf(statement)) {
      const expression = decorator.expression;

      if (
        ts.isCallExpression(expression) &&
        ts.isIdentifier(expression.expression) &&
        expression.expression.text === "Module"
      ) {
        moduleClass = statement.name.text;
        const argument = expression.arguments[0];

        if (argument && ts.isObjectLiteralExpression(argument)) {
          for (const property of argument.properties) {
            if (!ts.isPropertyAssignment(property)) continue;

            const propertyName = property.name
              .getText(sourceFile)
              .replace(/^["']|["']$/g, "");

            const value = ts.isArrayLiteralExpression(property.initializer)
              ? property.initializer.elements.map((element) => element.getText(sourceFile))
              : [property.initializer.getText(sourceFile)];

            if (propertyName === "imports") moduleImports = value;
            if (propertyName === "controllers") controllers = value;
            if (propertyName === "providers") providers = value;
            if (propertyName === "exports") exportsList = value;
          }
        }
      }
    }
  }

  const moduleSymbols = [];

  for (const expression of moduleImports) {
    moduleSymbols.push(
      ...(expression.match(/\b[A-Za-z_][A-Za-z0-9_]*Module\b/g) || []),
    );
  }

  const uniqueModuleSymbols = [...new Set(moduleSymbols)].sort();
  const unresolvedModuleSymbols = uniqueModuleSymbols.filter(
    (symbol) => !importedSymbols.has(symbol),
  );

  const duplicateImportSpecifiers = Object.entries(
    imports.reduce((acc, item) => {
      acc[item.moduleSpecifier] = (acc[item.moduleSpecifier] || 0) + 1;
      return acc;
    }, {}),
  )
    .filter(([, count]) => count > 1)
    .map(([moduleSpecifier, count]) => ({ moduleSpecifier, count }));

  const duplicateModuleSymbols = Object.entries(
    moduleSymbols.reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {}),
  )
    .filter(([, count]) => count > 1)
    .map(([symbol, count]) => ({ symbol, count }));

  const manifest = {
    success: parseDiagnostics.length === 0 && Boolean(moduleClass),
    system: "AVOS Architecture Refactoring Engine V4",
    generatedAt: new Date().toISOString(),
    typescriptVersion: ts.version,
    parser: {
      parseDiagnosticCount: parseDiagnostics.length,
      parseDiagnostics,
    },
    appModule: {
      found: Boolean(moduleClass),
      className: moduleClass,
      imports: moduleImports,
      controllers,
      providers,
      exports: exportsList,
    },
    importDeclarations: imports,
    moduleSymbols: {
      totalOccurrences: moduleSymbols.length,
      uniqueCount: uniqueModuleSymbols.length,
      symbols: uniqueModuleSymbols,
      unresolvedSymbols: unresolvedModuleSymbols,
      duplicates: duplicateModuleSymbols,
    },
    duplicateImportSpecifiers,
    safety: {
      analysisOnly: true,
      appModuleModified: false,
    },
  };

  const summary = {
    success: manifest.success,
    typescriptVersion: ts.version,
    parseDiagnostics: parseDiagnostics.length,
    statements: sourceFile.statements.length,
    appModuleFound: Boolean(moduleClass),
    appModuleClass: moduleClass,
    importDeclarations: imports.length,
    moduleImportExpressions: moduleImports.length,
    uniqueModuleSymbols: uniqueModuleSymbols.length,
    unresolvedModuleSymbols: unresolvedModuleSymbols.length,
    duplicateImportSpecifiers: duplicateImportSpecifiers.length,
    duplicateModuleSymbols: duplicateModuleSymbols.length,
    analysisOnly: true,
  };

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");

  console.log(JSON.stringify(summary, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
}
