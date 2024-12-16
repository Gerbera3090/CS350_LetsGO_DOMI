import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Dormitory Floors E2E Test', () => {
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

  describe('GET /dormitories/floors', () => {
    // 유효한 값 테스트
    it('should return floor data for a valid dormitoryId', async () => {
      const response = await request(app.getHttpServer())
        .get('/dormitories/floors')
        .query({ dormitoryId: 1 }) // Valid dormitoryId
        .expect(200);

      expect(response.body).toHaveProperty('floors');
      expect(response.body.floors).toBeInstanceOf(Array);
      expect(response.body.floors.length).toBeGreaterThan(0); // Floors should exist

      const floor = response.body.floors[0];
      expect(floor).toHaveProperty('id');
      expect(floor).toHaveProperty('floor');
      expect(typeof floor.id).toBe('number');
      expect(typeof floor.floor).toBe('number');
    });

    it('should return an empty array for a valid dormitoryId with no floors', async () => {
      const response = await request(app.getHttpServer())
        .get('/dormitories/floors')
        .query({ dormitoryId: 999 }) // Valid dormitoryId but no floors
        .expect(200);

      expect(response.body).toHaveProperty('floors');
      expect(response.body.floors).toEqual([]); // No floors expected
    });

    it('should return floors for a boundary dormitoryId', async () => {
      const response = await request(app.getHttpServer())
        .get('/dormitories/floors')
        .query({ dormitoryId: 2 }) // Boundary dormitoryId
        .expect(200);

      expect(response.body).toHaveProperty('floors');
      expect(response.body.floors).toBeInstanceOf(Array);
      expect(response.body.floors.length).toBeGreaterThan(0);

      const floor = response.body.floors[0];
      expect(floor).toHaveProperty('id');
      expect(floor).toHaveProperty('floor');
    });

    // 유효하지 않은 값 테스트
    it('should return 500 for an invalid dormitoryId (string)', async () => {
      const response = await request(app.getHttpServer())
        .get('/dormitories/floors')
        .query({ dormitoryId: 'invalid' }) // Invalid dormitoryId
        .expect(500);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeDefined();
    });

    it('should return 500 for a negative dormitoryId', async () => {
      const response = await request(app.getHttpServer())
        .get('/dormitories/floors')
        .query({ dormitoryId: -1 }) // Negative dormitoryId
        .expect(500);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeDefined();
    });

    it('should return 500 when dormitoryId is missing', async () => {
      const response = await request(app.getHttpServer())
        .get('/dormitories/floors')
        .expect(500);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBeDefined();
    });
  });
});
