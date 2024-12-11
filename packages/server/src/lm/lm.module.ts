import { Module } from '@nestjs/common';
import { LMController } from './lm.controller';
import { LMService } from './lm.service';
import { LMRepository } from './lm.repository';
import { DBModule } from 'src/db/db.module';
import { UserModule } from 'src/user/user.module';
import { MonitorModule } from 'src/monitor/monitor.module';

@Module({
  imports: [DBModule, UserModule, MonitorModule],
  controllers: [LMController],
  providers: [LMService, LMRepository],
})
export class LMModule {}
