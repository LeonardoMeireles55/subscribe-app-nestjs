import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ArrayContainedBy, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { Workshop } from 'src/workshop/entities/workShop.entity';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Workshop)
    private workshopRepository: Repository<Workshop>,
  ) {}

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User | void> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }
  async createUser(user: CreateUserDto): Promise<User> {
    const userData = this.userRepository.create(user);
    await this.userRepository.save(userData);
    return userData;
  }
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
  async subscribeUser(id: number, workShops: Workshop[]): Promise<User> {
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
