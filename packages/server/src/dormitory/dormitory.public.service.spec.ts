import { Test, TestingModule } from '@nestjs/testing';
import { DormitoryPublicService } from './dormitory.public.service';
import { DormitoryRepository } from './dormitory.repository';
import { DBModule } from '../db/db.module'; // 실제 DB 연결 모듈 import

describe('DormitoryPublicService (Integration Test)', () => {
  let service: DormitoryPublicService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DBModule], // DbModule에서 Drizzle ORM 및 연결 관리
      providers: [DormitoryPublicService, DormitoryRepository],
    }).compile();

    service = module.get<DormitoryPublicService>(DormitoryPublicService);
  });

  describe('getDormitoryInfo', () => {
    it('should return dormitory info for valid ID', async () => {
      const result = await service.getDormitoryInfo(1); // ID = 1
      expect(result).toEqual({
        id: 1,
        name: '미르관',
        nameEng: 'Mir Hall',
        maxFloor: 15,
        gender: 1,
        code: 'MIR',
      });
    });

    it('should throw an error for invalid dormitoryId', async () => {
      await expect(service.getDormitoryInfo(999)).rejects.toThrow(
        'Invalid dormitoryId',
      );
    });
  });

  describe('getDormitoryFloorInfo', () => {
    it('should return dormitory floor info for valid ID', async () => {
      const result = await service.getDormitoryFloorInfo(1); // Floor ID = 1
      expect(result).toEqual({
        id: 1,
        dormitoryId: 1,
        floor: 1,
      });
    });

    it('should throw an error for invalid dormitoryFloorId', async () => {
      await expect(service.getDormitoryFloorInfo(999)).rejects.toThrow(
        'Invalid dormitoryFloorId',
      );
    });
  });
});

describe('DormitoryPublicService', () => {
  let service: DormitoryPublicService;
  let repository: Partial<DormitoryRepository>;

  beforeEach(async () => {
    repository = {
      selectDormitory: jest.fn(),
      selectFloor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DormitoryPublicService,
        { provide: DormitoryRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<DormitoryPublicService>(DormitoryPublicService);
  });

  describe('getDormitoryInfo', () => {
    it('should return dormitory info when valid ID is provided', async () => {
      const mockResult = [{ id: 1, name: 'Dorm A' }];
      (repository.selectDormitory as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.getDormitoryInfo(1);
      expect(result).toEqual(mockResult[0]);
      expect(repository.selectDormitory).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error when dormitoryId is invalid', async () => {
      (repository.selectDormitory as jest.Mock).mockResolvedValue([]);

      await expect(service.getDormitoryInfo(1)).rejects.toThrow(
        'Invalid dormitoryId',
      );
      expect(repository.selectDormitory).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getDormitoryFloorInfo', () => {
    it('should return dormitory floor info when valid ID is provided', async () => {
      const mockResult = [{ id: 2, floor: 3 }];
      (repository.selectFloor as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.getDormitoryFloorInfo(2);
      expect(result).toEqual(mockResult[0]);
      expect(repository.selectFloor).toHaveBeenCalledWith({ id: 2 });
    });

    it('should throw an error when dormitoryFloorId is invalid', async () => {
      (repository.selectFloor as jest.Mock).mockResolvedValue([]);

      await expect(service.getDormitoryFloorInfo(2)).rejects.toThrow(
        'Invalid dormitoryFloorId',
      );
      expect(repository.selectFloor).toHaveBeenCalledWith({ id: 2 });
    });
  });
});
