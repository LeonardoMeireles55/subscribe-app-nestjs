import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkshopEntity } from 'src/entities/workshop.entity';
import { WorkshopController } from './workshop.controller';
import { WorkshopService } from './workshop.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkshopEntity])],
  providers: [WorkshopService],
  controllers: [WorkshopController],
  exports: [WorkshopService],
})
export class WorkshopModule {}
