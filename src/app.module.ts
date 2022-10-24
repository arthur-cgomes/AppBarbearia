import { Module } from '@nestjs/common';
import { ormConfig } from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserTypeModule } from './user-type/user-type.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
    UserTypeModule,
  ],
})
export class AppModule {}
