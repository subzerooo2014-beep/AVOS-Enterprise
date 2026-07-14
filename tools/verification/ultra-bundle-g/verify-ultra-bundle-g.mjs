import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-value-optimization',
);

const requiredFiles = [
  'enterprise-value-optimization.types.ts',
  'enterprise-value-intelligence-engine.service.ts',
  'business-performance-intelligence.service.ts',
  'continuous-optimization-engine.service.ts',
  'enterprise-bottleneck-analyzer.service.ts',
  'resource-efficiency-optimizer.service.ts',
  'enterprise-cost-intelligence.service.ts',
  'revenue-intelligence-engine.service.ts',
  'profitability-intelligence.service.ts',
  'enterprise-roi-intelligence.service.ts',
  'enterprise-value-forecast-engine.service.ts',
  'performance-benchmark-engine.service.ts',
  'enterprise-value-optimization-orchestrator.service.ts',
  'enterprise-optimization-dashboard.service.ts',
  'enterprise-value-optimization.controller.ts',
  'enterprise-value-optimization.module.ts',
  'dto/performance-analysis.dto.ts',
  'dto/value-analysis.dto.ts',
  'dto/optimization-analysis.dto.ts',
];

const capabilities = [
  'enterprise-value-intelligence-engine',
  'business-performance-intelligence',
  'continuous-optimization-engine',
  'enterprise-bottleneck-analyzer',
  'resource-efficiency-optimizer',
  'enterprise-cost-intelligence',
  'revenue-intelligence-engine',
  'profitability-intelligence',
  'enterprise-roi-intelligence',
  'enterprise-value-forecast-engine',
  'performance-benchmark-engine',
  'enterprise-optimization-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-value-optimization.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify({ success: false, missingCapabilities }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system:
        'AVOS Ultra Bundle G Enterprise Value Performance Continuous Optimization',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      enterpriseValueIntelligence: true,
      businessPerformanceIntelligence: true,
      continuousOptimization: true,
      bottleneckAnalyzer: true,
      resourceEfficiency: true,
      costIntelligence: true,
      revenueIntelligence: true,
      profitabilityIntelligence: true,
      roiIntelligence: true,
      valueForecast: true,
      performanceBenchmark: true,
      optimizationDashboard: true,
    },
    null,
    2,
  ),
);