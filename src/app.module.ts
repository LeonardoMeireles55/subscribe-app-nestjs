import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { WorkshopEntity } from './entities/workshop.entity';
import { UserModule } from './web/user/user.module';
import { AuthModule } from './web/auth/auth.module';
import { WorkshopModule } from './web/workshop/workshop.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      }
    }),
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
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    WorkshopModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
