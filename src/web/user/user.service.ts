import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/create.user.dto';
import { WorkshopEntity } from 'src/entities/workshop.entity';
import { UpdateUserDto } from '../../dto/update.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UserService {
  private saltOrRounds: number = 10;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WorkshopEntity)
    private readonly workshopRepository: Repository<WorkshopEntity>,
  ) { }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!await bcrypt.compare(oldPassword, user.password)) {
      throw new ConflictException('Password is incorrect');
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      throw new ConflictException('Password is the same as the current one');
    }

    const hashPass = await bcrypt.hash(newPassword, this.saltOrRounds);
    user.password = hashPass;
    await this.userRepository.save(user);
  }


  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  async createUser(user: CreateUserDto): Promise<void> {
    if (await this.userRepository.findOne({ where: { email: user.email } })) {
      throw new ConflictException('User already exists');
    }

    const hashPass = await bcrypt.hash(user.password, this.saltOrRounds);

    let data = {
      ...user,
      password: hashPass,
    };

    await this.userRepository.save(data);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getSuscribedWorkshops(id: number): Promise<WorkshopEntity[] | number[]> {
    const user = await this.getUserByIdWithWorkShops(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.workShops;
  }

  async getUserByIdWithWorkShops(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['workShops'],
    });
  }

  async subscribeUser(userId: number, workshopIds: number[]): Promise<UserEntity> {
    return await this.userRepository.manager.transaction(async (manager) => {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const existingWorkshops = await this.workshopRepository.findBy({
        id: In(workshopIds),
      });

      const subscriptions = await this.getSuscribedWorkshops(userId);

      workshopIds.forEach((workshopId) => {
        if (subscriptions.find((workshop: WorkshopEntity) => workshop.id === workshopId)) {
          throw new ConflictException(
            `User is already subscribed to workshop ${workshopId}`,
          );
        }
      });

      if (existingWorkshops.length !== workshopIds.length) {
        throw new NotFoundException('Workshop not found');
      }
      if (existingWorkshops.some(workshop => workshop.endDate < new Date()
        || !workshop.isActive || workshop.startDate > new Date())) {
        throw new Error
          ('Workshop has ended or Workshops are not active or Workshop has not started yet');
      }

      existingWorkshops.forEach((workshop) => {
        if (workshop.capacity <= 0) {
          throw new Error(`Workshop ${workshop.name} is full`);
        }
      });

      existingWorkshops.forEach((workshop) => {
        workshop.capacity -= 1;
      });

      user.workShops = [...subscriptions, ...existingWorkshops] as WorkshopEntity[];

      await manager.save(existingWorkshops);
      return await manager.save(user);
    });
  }
}
