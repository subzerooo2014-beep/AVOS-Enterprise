#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function abort(message, details) {
  console.error(JSON.stringify({ success: false, message, details }, null, 2));
  process.exit(1);
}

function loadConfig(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    abort('Unable to load config.', String(error));
  }
}

function sourceFile(file, text) {
  return ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
}

function decoratorsOf(node) {
  return (node.modifiers ?? []).filter(ts.isDecorator);
}

function moduleClassOf(file) {
  for (const statement of file.statements) {
    if (!ts.isClassDeclaration(statement)) continue;

    for (const decorator of decoratorsOf(statement)) {
      const expression = decorator.expression;

      if (
        ts.isCallExpression(expression) &&
        ts.isIdentifier(expression.expression) &&
        expression.expression.text === 'Module'
      ) {
        return { classNode: statement, decorator };
      }
    }
  }

  return undefined;
}

function moduleMetadataOf(decorator) {
  const call = decorator.expression;

  if (
    !ts.isCallExpression(call) ||
    call.arguments.length !== 1 ||
    !ts.isObjectLiteralExpression(call.arguments[0])
  ) {
    abort('@Module must contain one object literal.');
  }

  return call.arguments[0];
}

function propertyNameOf(name, file) {
  return name.getText(file).replace(/^['"]|['"]$/g, '');
}

function arrayPropertyOf(metadata, name, file) {
  return metadata.properties.find((property) =>
    ts.isPropertyAssignment(property) &&
    propertyNameOf(property.name, file) === name
  );
}

function ensureNamedImport(file, symbol, from) {
  const statements = [...file.statements];

  for (let index = 0; index < statements.length; index++) {
    const statement = statements[index];

    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== from
    ) {
      continue;
    }

    const clause = statement.importClause;

    if (
      !clause ||
      !clause.namedBindings ||
      !ts.isNamedImports(clause.namedBindings)
    ) {
      abort(`Import from ${from} is not a named import.`);
    }

    if (
      clause.namedBindings.elements.some(
        (element) => element.name.text === symbol,
      )
    ) {
      return { file, changed: false };
    }

    const named = ts.factory.updateNamedImports(
      clause.namedBindings,
      [
        ...clause.namedBindings.elements,
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier(symbol),
        ),
      ],
    );

    const nextClause = ts.factory.updateImportClause(
      clause,
      clause.isTypeOnly,
      clause.name,
      named,
    );

    statements[index] = ts.factory.updateImportDeclaration(
      statement,
      statement.modifiers,
      nextClause,
      statement.moduleSpecifier,
      statement.attributes,
    );

    return {
      file: ts.factory.updateSourceFile(file, statements),
      changed: true,
    };
  }

  const declaration = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier(symbol),
        ),
      ]),
    ),
    ts.factory.createStringLiteral(from),
    undefined,
  );

  let index = 0;
  while (
    index < statements.length &&
    ts.isImportDeclaration(statements[index])
  ) {
    index++;
  }

  statements.splice(index, 0, declaration);

  return {
    file: ts.factory.updateSourceFile(file, statements),
    changed: true,
  };
}

function ensureModuleArrayEntry(file, propertyName, symbol) {
  const moduleClass = moduleClassOf(file);

  if (!moduleClass) {
    abort('No @Module class was found.');
  }

  const metadata = moduleMetadataOf(moduleClass.decorator);
  const property = arrayPropertyOf(metadata, propertyName, file);
  const properties = [...metadata.properties];

  if (property) {
    if (!ts.isArrayLiteralExpression(property.initializer)) {
      abort(`@Module.${propertyName} must be an array literal.`);
    }

    if (
      property.initializer.elements.some(
        (element) => element.getText(file) === symbol,
      )
    ) {
      return { file, changed: false };
    }

    const propertyIndex = properties.indexOf(property);
    const nextArray = ts.factory.updateArrayLiteralExpression(
      property.initializer,
      [
        ...property.initializer.elements,
        ts.factory.createIdentifier(symbol),
      ],
    );

    properties[propertyIndex] = ts.factory.updatePropertyAssignment(
      property,
      property.name,
      nextArray,
    );
  } else {
    properties.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier(propertyName),
        ts.factory.createArrayLiteralExpression(
          [ts.factory.createIdentifier(symbol)],
          true,
        ),
      ),
    );
  }

  const nextMetadata = ts.factory.updateObjectLiteralExpression(
    metadata,
    properties,
  );

  const oldCall = moduleClass.decorator.expression;
  const nextCall = ts.factory.updateCallExpression(
    oldCall,
    oldCall.expression,
    oldCall.typeArguments,
    [nextMetadata],
  );

  const nextDecorator = ts.factory.updateDecorator(
    moduleClass.decorator,
    nextCall,
  );

  const modifiers = [...(moduleClass.classNode.modifiers ?? [])];
  const decoratorIndex = modifiers.indexOf(moduleClass.decorator);

  if (decoratorIndex < 0) {
    abort('Unable to replace @Module decorator.');
  }

  modifiers[decoratorIndex] = nextDecorator;

  const nextClass = ts.factory.updateClassDeclaration(
    moduleClass.classNode,
    modifiers,
    moduleClass.classNode.name,
    moduleClass.classNode.typeParameters,
    moduleClass.classNode.heritageClauses,
    moduleClass.classNode.members,
  );

  const statements = file.statements.map((statement) =>
    statement === moduleClass.classNode ? nextClass : statement
  );

  return {
    file: ts.factory.updateSourceFile(file, statements),
    changed: true,
  };
}

function apply(file, operation) {
  switch (operation.type) {
    case 'ensureNamedImport':
      return ensureNamedImport(file, operation.symbol, operation.from);
    case 'ensureModuleImport':
      return ensureModuleArrayEntry(file, 'imports', operation.symbol);
    case 'ensureModuleProvider':
      return ensureModuleArrayEntry(file, 'providers', operation.symbol);
    case 'ensureModuleExport':
      return ensureModuleArrayEntry(file, 'exports', operation.symbol);
    case 'ensureModuleController':
      return ensureModuleArrayEntry(file, 'controllers', operation.symbol);
    default:
      abort(`Unsupported operation: ${operation.type}`);
  }
}

function run(configPath) {
  const config = loadConfig(configPath);

  if (!config.file || !Array.isArray(config.operations)) {
    abort('Config requires file and operations.');
  }

  const target = path.resolve(config.file);

  if (!fs.existsSync(target)) {
    abort(`Target does not exist: ${target}`);
  }

  const original = fs.readFileSync(target, 'utf8');
  let file = sourceFile(target, original);
  let changed = false;

  for (const operation of config.operations) {
    const result = apply(file, operation);
    file = result.file;
    changed = changed || result.changed;
  }

  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  });

  const output = printer.printFile(file);

  if (changed && output !== original) {
    fs.writeFileSync(target, output, 'utf8');
  }

  console.log(JSON.stringify({
    success: true,
    engine: 'AVOS Refactoring Engine',
    version: '1.0.0',
    file: target,
    changed: changed && output !== original,
    operations: config.operations.length,
  }, null, 2));
}

const configPath = process.argv[2];

if (!configPath) {
  abort('Usage: node avos-refactor-engine.cjs <config.json>');
}

run(path.resolve(configPath));