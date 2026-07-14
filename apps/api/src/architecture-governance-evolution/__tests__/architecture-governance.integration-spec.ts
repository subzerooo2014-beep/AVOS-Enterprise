import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ArchitectureGovernanceModule } from '../architecture-governance.module';

describe('Architecture governance integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ArchitectureGovernanceModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the real capability registry', async () => {
    const response = await request(app.getHttpServer())
      .get('/architecture-governance/capabilities')
      .expect(200);

    expect(response.body.count).toBe(11);
    expect(response.body.capabilities).toContain('ai-architecture-genome');
    expect(response.body.capabilities).toContain('governance-evolution');
  });

  it('runs a self-design architecture cycle', async () => {
    const response = await request(app.getHttpServer())
      .post('/architecture-governance/self-design')
      .send({
        objective: 'increase architecture fitness',
        signals: [
          {
            id: 'api-runtime',
            source: 'integration-test',
            category: 'runtime',
            value: 88,
            confidence: 0.95,
            observedAt: new Date().toISOString(),
          },
        ],
        constraints: ['security-by-design'],
      })
      .expect(201);

    expect(response.body.genome).toBeDefined();
    expect(response.body.proposal).toBeDefined();
    expect(response.body.decision).toBeDefined();
    expect(response.body.evolution.sequence).toBe(1);
  });
});