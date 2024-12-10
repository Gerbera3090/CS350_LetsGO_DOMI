import { Module } from '@nestjs/common';
import { MonitorController } from './monitor.controller';
import { MonitorService } from './monitor.service';
import { MonitorRepository } from './monitor.repository';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [MonitorController],
  providers: [MonitorService, MonitorRepository],
})
export class MonitorModule {}
