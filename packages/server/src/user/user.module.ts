import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserPublicService } from './user.public.service';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserPublicService],
  exports: [UserPublicService],
})
export class UserModule {}
