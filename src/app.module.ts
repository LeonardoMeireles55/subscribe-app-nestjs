import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { WorkshopEntity } from './entities/workshop.entity';
import { UserModule } from './web/user/user.module';
import { AuthModule } from './web/auth/auth.module';
import { WorkshopModule } from './web/workshop/workshop.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'subscribe_db',
      entities: [UserEntity, WorkshopEntity],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    WorkshopModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
