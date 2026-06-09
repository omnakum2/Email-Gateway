import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity';
import { CreateUserDto } from './Dtos/CreateUserDto';
import { UpdateUserDto } from './Dtos/UpdateUserDto';
import { GetUserDto } from './Dtos/GetUserDto';
import { UserMapper } from './UserMapper';
import { ApiKeyService } from '../ApiKey/ApiKeyService';
import { ApiKeyType } from '../../Common/Enums/ApiKeyType';
import { UserType } from '../../Common/Enums/UserType';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userMapper: UserMapper,
    private readonly apiKeyService: ApiKeyService,
  ) { }

  // Create a new User.
  async create(dto: CreateUserDto): Promise<GetUserDto> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });

    if (existing) throw new ConflictException(`User with email "${dto.email}" already exists`);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const consumer = this.userRepository.create(dto);
    const createdUser = await this.userRepository.save(consumer);
    if (createdUser.userType === UserType.SUPER_ADMIN) return this.userMapper.mapToGet(createdUser);

    // Generate API keys for consumers accounts only.
    let result;
    if (createdUser.id) {
      result = await this.apiKeyService.create({ type: ApiKeyType.Secret }, createdUser);
    }
    return this.userMapper.mapToGet(createdUser, result);
  }

  // Get all users.
  async findAll(): Promise<GetUserDto[]> {
    const users = await this.userRepository.find({ order: { createdAt: 'DESC' } });
    return this.userMapper.mapToGetList(users);
  }

  // Get a user by ID.
  async findOne(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return this.userMapper.mapToGet(user);
  }

  // Get a user by email.
  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(`User with email "${email}" not found`);
    return user;
  }

  // Update a user by ID.
  async update(id: string, dto: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    return this.userMapper.mapToGet(saved);
  }

  // Delete a user by ID.
  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    await this.userRepository.remove(user);
  }

  // Internal helper for authentication flows.
  async findOneWithPasswordHash(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  // Update password hash.
  async updatePasswordHash(userId: string, passwordHash: string) {
    await this.findOne(userId);
    await this.userRepository.update({ id: userId }, { password: passwordHash });
    return { message: 'Password updated' };
  }
}
