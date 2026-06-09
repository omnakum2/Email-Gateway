import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ApiKeyEntity } from './ApiKeyEntity';
import { UserEntity } from '../User/UserEntity';
import { ApiKeyCreatedDto } from './Dtos/ApiKeyCreatedDto';
import { Status } from '../../Common/Enums/Status';
import { ApiKeyType } from '../../Common/Enums/ApiKeyType';
import { CreateApiKeyDto } from './Dtos/CreateApiKeyDto';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
  ) { }

  // Generate a new API key for a consumer.
  async create(dto: CreateApiKeyDto, user: UserEntity): Promise<ApiKeyCreatedDto> {
    const existingKey = await this.apiKeyRepository.findOne({ where: { consumer: { id: user.id }, type: dto.type } });
    if (existingKey) {
      throw new ConflictException(`API key of type (${dto.type}) already exists for this account`);
    }

    const isSecretKey = dto.type === ApiKeyType.Secret;
    
    // Generate raw key
    const rawToken = crypto.randomBytes(24).toString('hex');
    const prefix = isSecretKey ? 'mail_live_' : 'mail_pk_';
    const rawKey = `${prefix}${rawToken}`;

    // Store prefix for display (first 14 chars + mask).
    const keyPrefix = `${rawKey.substring(0, 14)}****`;

    // Hash the full key with bcrypt.
    const keyHash = await bcrypt.hash(rawKey, 10);

    const apiKey = this.apiKeyRepository.create({
      type: isSecretKey ? ApiKeyType.Secret : ApiKeyType.Public,
      keyPrefix,
      keyHash,
      status: Status.Active,
      consumer: { id: user.id }
    });

    const saved = await this.apiKeyRepository.save(apiKey);

    // Return the full key only once.
    const result = new ApiKeyCreatedDto();
    result.id = saved.id;
    result.apiKey = rawKey;
    result.keyPrefix = keyPrefix;
    result.message = 'Store this key securely. It will not be shown again.';
    return result;
  }

  // Revoke an API key.
  async revoke(id: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
    if (!apiKey) throw new NotFoundException(`API key with id "${id}" not found`);
    await this.apiKeyRepository.update(apiKey.id, { status: Status.Inactive });
    return true;
  }

  // Validate an API key specifically focusing on Secret or Public keys.
  async validateKey(rawKey: string, type: ApiKeyType): Promise<UserEntity | null> {
    // Find all active keys matching the specific type.
    const activeKeys = await this.apiKeyRepository.find({
      where: { status: Status.Active, type },
      relations: {
        consumer: true
      },
    });

    for (const apiKey of activeKeys) {
      if (apiKey.consumer && apiKey.consumer.status === Status.Active) {
        const isMatch = await bcrypt.compare(rawKey, apiKey.keyHash);
        if (isMatch) {
          // Update last used timestamp.
          await this.apiKeyRepository.update(apiKey.id, { lastUsedAt: new Date() });
          return apiKey.consumer;
        }
      }
    }

    return null;
  }

  // Delete an API key by ID.
  async delete(id: string): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
    if (!apiKey) throw new NotFoundException(`API key with id "${id}" not found`);
    await this.apiKeyRepository.remove(apiKey);
  }
}
