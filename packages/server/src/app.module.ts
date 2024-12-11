import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { MonitorModule } from './monitor/monitor.module';
import { DBModule } from './db/db.module';
import { LMModule } from './lm/lm.module';
import { DormitoryModule } from './dormitory/dormitory.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MonitorModule,
    DBModule,
    LMModule,
    DormitoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
