import { Injectable } from '@nestjs/common';
import { UserEntity } from './UserEntity';
import { GetUserDto } from './Dtos/GetUserDto';
import { ApiKeyCreatedDto } from '../ApiKey/Dtos/ApiKeyCreatedDto';

// Maps consumer entities to response DTOs.
@Injectable()
export class UserMapper {
  mapToGet(entity: UserEntity, apiKey?: ApiKeyCreatedDto): GetUserDto {
    const dto = new GetUserDto();
    dto.id = entity.id;
    dto.fullName = entity.fullName;
    dto.email = entity.email;
    dto.userType = entity.userType;
    dto.status = entity.status;
    dto.defaultFromName = entity.defaultFromName;
    dto.defaultReplyToEmail = entity.defaultReplyToEmail;
    dto.footerText = entity.footerText;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;

    if (apiKey) {
      dto.apiKey = apiKey;
    }
    return dto;
  }

  mapToGetList(entities: UserEntity[]): GetUserDto[] {
    return entities.map((entity) => this.mapToGet(entity));
  }
}
