import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'ai-agent-os-v2',
);

const required = [
  'ai-agent-os-v2.types.ts',
  'ai-agent-capability-base.service.ts',
  'ai-agent-capability-registry.service.ts',
  'ai-agent-os-v2-orchestrator.service.ts',
  'ai-agent-os-v2-dashboard.service.ts',
  'ai-agent-os-v2.controller.ts',
  'ai-agent-os-v2.module.ts',
  'dto/agent-operation.dto.ts',
];

const missing = required.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

const services = fs.existsSync(
  path.join(featureRoot, 'services'),
)
  ? fs
      .readdirSync(path.join(featureRoot, 'services'))
      .filter((file) => file.endsWith('.service.ts'))
  : [];

const controllers = fs.existsSync(
  path.join(featureRoot, 'controllers'),
)
  ? fs
      .readdirSync(path.join(featureRoot, 'controllers'))
      .filter((file) =>
        file.endsWith('-agent-os.controller.ts'),
      )
  : [];

const types = fs.existsSync(
  path.join(featureRoot, 'ai-agent-os-v2.types.ts'),
)
  ? fs.readFileSync(
      path.join(featureRoot, 'ai-agent-os-v2.types.ts'),
      'utf8',
    )
  : '';

const capabilities = [
  ...types.matchAll(/^\s*'([^']+)',?\s*$/gm),
].map((match) => match[1]);

const appModule = fs.readFileSync(
  path.join(root, 'apps', 'api', 'src', 'app.module.ts'),
  'utf8',
);

const moduleRegistrationCount = (
  appModule.match(/\bAiAgentOsV2Module\b/g) ?? []
).length;

const passed =
  missing.length === 0 &&
  services.length === 100 &&
  controllers.length === 11 &&
  capabilities.length === 100 &&
  moduleRegistrationCount === 2;

if (!passed) {
  console.error(
    JSON.stringify(
      {
        success: false,
        missing,
        services: services.length,
        controllers: controllers.length,
        capabilities: capabilities.length,
        moduleRegistrationCount,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'Mega System 2 - AI Agent Operating System',
      capabilities: capabilities.length,
      services: services.length,
      controllers: controllers.length,
      moduleRegistered: true,
      verificationStatus: 'passed',
    },
    null,
    2,
  ),
);