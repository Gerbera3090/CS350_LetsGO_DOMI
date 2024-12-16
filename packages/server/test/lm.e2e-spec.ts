import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('LMController E2E Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /lms (LMC-001)', () => {
    it('should return the list of LMs in the user dormitory floor', async () => {
      const response = await request(app.getHttpServer())
        .get('/lms')
        .query({ userId: 1, dormitoryFloorId: 1 })
        .expect(200);

      expect(response.body).toHaveProperty('lms');
      expect(Array.isArray(response.body.lms)).toBe(true);

      response.body.lms.forEach((lm: any) => {
        expect(lm).toHaveProperty('id');
        expect(typeof lm.id).toBe('number');

        expect(lm).toHaveProperty('lmTypeEnum');
        expect(typeof lm.lmTypeEnum).toBe('number');

        expect(lm).toHaveProperty('lmStatusEnum');
        expect(typeof lm.lmStatusEnum).toBe('number');

        expect(lm).toHaveProperty('reportStatusEnum');
        expect(typeof lm.reportStatusEnum).toBe('number');

        expect(lm).toHaveProperty('code');
        expect(typeof lm.code).toBe('string');

        expect(lm).toHaveProperty('last');
        expect(lm.last === null || typeof lm.last === 'number').toBe(true);

        expect(lm).toHaveProperty('alarmed');
        expect(typeof lm.alarmed).toBe('boolean');

        expect(lm).toHaveProperty('isFLM');
        expect(typeof lm.isFLM).toBe('boolean');
      });
    });

    it('should return 500 for invalid dormitoryFloorId', async () => {
      const response = await request(app.getHttpServer())
        .get('/lms')
        .query({ userId: 1, dormitoryFloorId: 999 }) // Invalid dormitoryFloorId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .get('/lms')
        .query({ userId: 999, dormitoryFloorId: 1 }) // Invalid userId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing dormitoryFloorId', async () => {
      const response = await request(app.getHttpServer())
        .get('/lms')
        .query({ userId: 1 }) // Invalid dormitoryFloorId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing userId', async () => {
      const response = await request(app.getHttpServer())
        .get('/lms')
        .query({ dormitoryFloorId: 1 }) // Invalid userId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /lms/flms (LMC-002)', () => {
    it('should return the list of FLMs sorted by usage and priority', async () => {
      const response = await request(app.getHttpServer())
        .get('/lms/flms')
        .query({ userId: 1 })
        .expect(200);

      expect(response.body).toHaveProperty('flms');
      expect(Array.isArray(response.body.flms)).toBe(true);

      response.body.flms.forEach((flm: any) => {
        expect(flm).toHaveProperty('id');
        expect(typeof flm.id).toBe('number');

        expect(flm).toHaveProperty('priority');
        expect(typeof flm.priority).toBe('number');

        expect(flm).toHaveProperty('floor');
        expect(typeof flm.floor).toBe('number');

        expect(flm).toHaveProperty('code');
        expect(typeof flm.code).toBe('string');

        expect(flm).toHaveProperty('lmTypeEnum');
        expect(typeof flm.lmTypeEnum).toBe('number');

        expect(flm).toHaveProperty('reportStatusEnum');
        expect(typeof flm.reportStatusEnum).toBe('number');

        expect(flm).toHaveProperty('lmStatusEnum');
        expect(typeof flm.lmStatusEnum).toBe('number');

        expect(flm).toHaveProperty('last');
        expect(typeof flm.last).toBe('number');

        expect(flm).toHaveProperty('alarmed');
        expect(typeof flm.alarmed).toBe('boolean');
      });
    });

    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .get('/lms/flms')
        .query({ userId: 999 }) // Invalid userId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /lms/flm (LMC-003)', () => {
    it('should add a new FLM for the user', async () => {
      const response = await request(app.getHttpServer())
        .post('/lms/flm')
        .send({ userId: 1, lmId: 1 })
        .expect(201);

      expect(response.body).toHaveProperty('flmId');
      expect(typeof response.body.flmId).toBe('number');
    });

    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .post('/lms/flm')
        .send({ userId: 999, lmId: 1 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for invalid lmId', async () => {
      const response = await request(app.getHttpServer())
        .post('/lms/flm')
        .send({ userId: 1, lmId: 999 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing userId', async () => {
      const response = await request(app.getHttpServer())
        .post('/lms/flm')
        .send({ lmId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing lmId', async () => {
      const response = await request(app.getHttpServer())
        .post('/lms/flm')
        .send({ userId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /lms/flm (LMC-004)', () => {
    it('should delete an existing FLM for the user', async () => {
      const response = await request(app.getHttpServer())
        .delete('/lms/flm')
        .send({ userId: 1, lmId: 1 })
        .expect(200);

      expect(response.body).toHaveProperty('flmId');
      expect(typeof response.body.flmId).toBe('number');
    });

    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/lms/flm')
        .send({ userId: 999, lmId: 1 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for invalid lmId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/lms/flm')
        .send({ userId: 1, lmId: 999 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing userId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/lms/flm')
        .send({ lmId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing lmId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/lms/flm')
        .send({ userId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });
});
