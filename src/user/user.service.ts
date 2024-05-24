import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { Workshop } from 'src/workshop/entities/workShop.entity';

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
  ): Promise<UserEntity | void> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
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
  async subscribeUser(id: number, workShops: Workshop[]): Promise<UserEntity> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const workshopIds = workShops.map((ws) => ws.id);
    // const existingWorkshops = await this.workshopRepository.findBy({
    //   id: ArrayContainedBy(workshopIds),
    // });

    const existingWorkshops = await this.workshopRepository.findBy({
      id: In(workshopIds),
    });

    if (existingWorkshops.length !== workShops.length) {
      throw new Error('One or more workshops not found');
    }

    user.workShops = existingWorkshops;
    return await this.userRepository.save(user);
  }
}
