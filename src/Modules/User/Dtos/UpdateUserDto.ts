import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './CreateUserDto';

// DTO for updating a consumer.
export class UpdateUserDto extends PartialType(CreateUserDto) { }
