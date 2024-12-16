import { Config } from 'jest';
import * as dotenv from 'dotenv';

// 프로젝트 루트 디렉토리의 .env 파일 로드
dotenv.config({ path: '../../.env' }); // 모노레포 루트의 .env 경로

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@schema$': '<rootDir>/src/db/schema',
  },
  testEnvironment: 'node',
};

export default config;
