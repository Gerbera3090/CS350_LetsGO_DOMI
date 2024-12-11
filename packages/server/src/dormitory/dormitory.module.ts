import { Module } from '@nestjs/common';
import { DormitoryController } from './dormitory.controller';
import { DormitoryService } from './dormitory.service';
import { DormitoryRepository } from './dormitory.repository';
import { DormitoryPublicService } from './dormitory.public.service';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [DormitoryController],
  providers: [DormitoryService, DormitoryRepository, DormitoryPublicService],
  exports: [DormitoryPublicService],
})
export class DormitoryModule {}
