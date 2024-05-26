import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWorkshopDto } from 'src/web/dto/create.workshop.dto';
import { WorkshopEntity } from 'src/entities/workshop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectRepository(WorkshopEntity)
    private readonly workshopRepository: Repository<WorkshopEntity>,
  ) { }

  async getAllWorkshops(): Promise<WorkshopEntity[]> {
    return await this.workshopRepository.find();
  }

  async getWorkshopById(id: number): Promise<WorkshopEntity> {
    const workshop = await this.workshopRepository.findOne({ where: { id } });
    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }
    return workshop;
  }

  async createWorkshop(workshop: CreateWorkshopDto): Promise<WorkshopEntity> {
    try {
      const createdWorkshop = await this.workshopRepository.save(workshop);
      return createdWorkshop;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

}
