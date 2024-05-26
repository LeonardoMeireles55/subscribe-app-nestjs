import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkshopEntity } from 'src/entities/workshop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectRepository(WorkshopEntity)
    private readonly workshopRepository: Repository<WorkshopEntity>,
  ) {}

  async getAllWorkshops(): Promise<WorkshopEntity[]> {
    return await this.workshopRepository.find();
  }
}
