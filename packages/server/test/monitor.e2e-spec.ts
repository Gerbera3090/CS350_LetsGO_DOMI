import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Monitor E2E Test', () => {
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

  describe('POST /monitor/track/:lmId (MNT-001)', () => {
    it('should create a new track object', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/track/1')
        .send({ trackerId: 1, intensity: 5 })
        .expect(201);

      expect(response.body).toHaveProperty('trackId');
      expect(typeof response.body.trackId).toBe('number');
    });

    it('should return 500 for invalid laundryMachineId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/track/999') // Invalid laundryMachineId
        .send({ trackerId: 1, intensity: 5 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing trackerId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/track/1')
        .send({ intensity: 5 }) // Missing trackerId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /monitor/tracks (MNT-002)', () => {
    it('should return a list of track objects', async () => {
      const response = await request(app.getHttpServer())
        .get('/monitor/tracks')
        .expect(200);

      expect(response.body).toHaveProperty('trackData');
      expect(response.body.trackData).toBeInstanceOf(Array);
      expect(response.body.trackData.length).toBeGreaterThan(0);
    });
  });

  describe('POST /monitor/usage-alarm (MNT-003)', () => {
    it('should create a new usage alarm', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/usage-alarm')
        .send({ userId: 1, lmId: 1 })
        .expect(201);

      expect(response.body).toHaveProperty('usageAlarmId');
      expect(typeof response.body.usageAlarmId).toBe('number');
    });

    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/usage-alarm')
        .send({ userId: 999, lmId: 1 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for invalid lmId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/usage-alarm')
        .send({ userId: 1, lmId: 999 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing userId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/usage-alarm')
        .send({ lmId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing lmId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/usage-alarm')
        .send({ userId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /monitor/usage-alarm (MNT-004)', () => {
    it('should delete an existing usage alarm', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/usage-alarm')
        .send({ userId: 1, lmId: 1 })
        .expect(200);

      expect(response.body).toHaveProperty('usageAlarmId');
      expect(typeof response.body.usageAlarmId).toBe('number');
    });

    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/usage-alarm')
        .send({ userId: 999, lmId: 1 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for invalid lmId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/usage-alarm')
        .send({ userId: 1, lmId: 999 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing userId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/usage-alarm')
        .send({ lmId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing lmId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/usage-alarm')
        .send({ userId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /monitor/reserve-alarm (MNT-005)', () => {
    it('should create a new reserve alarm', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/reserve-alarm')
        .send({ userId: 1, lmId: 1 })
        .expect(201);

      expect(response.body).toHaveProperty('reserveAlarmId');
      expect(typeof response.body.reserveAlarmId).toBe('number');
    });
    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/reserve-alarm')
        .send({ userId: 999, lmId: 1 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for invalid lmId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/reserve-alarm')
        .send({ userId: 1, lmId: 999 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing userId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/reserve-alarm')
        .send({ lmId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing lmId', async () => {
      const response = await request(app.getHttpServer())
        .post('/monitor/reserve-alarm')
        .send({ userId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /monitor/reserve-alarm (MNT-006)', () => {
    it('should delete an existing reserve alarm', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/reserve-alarm')
        .send({ userId: 1, lmId: 1 })
        .expect(200);

      expect(response.body).toHaveProperty('reserveAlarmId');
      expect(typeof response.body.reserveAlarmId).toBe('number');
    });

    it('should return 500 for invalid userId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/reserve-alarm')
        .send({ userId: 999, lmId: 1 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for invalid lmId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/reserve-alarm')
        .send({ userId: 1, lmId: 999 })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing userId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/reserve-alarm')
        .send({ lmId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 500 for missing lmId', async () => {
      const response = await request(app.getHttpServer())
        .delete('/monitor/reserve-alarm')
        .send({ userId: 1 }) // Missing lmId
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });
});
