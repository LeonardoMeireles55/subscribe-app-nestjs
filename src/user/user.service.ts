import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { Workshop } from 'src/workshop/entities/workShop.entity';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
  ) {}

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const userData = this.userRepository.create(user);
    await this.userRepository.save(userData);
    return userData;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async subscribeUser(id: number, workshopIds: number[]): Promise<UserEntity> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingWorkshops =
      await this.workshopRepository.findByIds(workshopIds);

    if (existingWorkshops.length !== workshopIds.length) {
      throw new NotFoundException('One or more workshops not found');
    }

    user.workShops = existingWorkshops;
    return await this.userRepository.save(user);
  }
}
