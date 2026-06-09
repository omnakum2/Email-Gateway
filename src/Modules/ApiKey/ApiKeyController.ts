import { Controller, Post, Patch, Param, Body, UseGuards, Delete, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyService } from './ApiKeyService';
import { CreateApiKeyDto } from './Dtos/CreateApiKeyDto';
import { ApiKeyCreatedDto } from './Dtos/ApiKeyCreatedDto';
import { AuthGuard } from '../Auth/AuthGuard';
import type { IUserRequest } from '../Auth/AuthGuard';
import { ApiKeyType } from '../../Common/Enums/ApiKeyType';

@ApiTags('API Keys')
@UseGuards(AuthGuard)
@Controller('api-keys')
@ApiBearerAuth()
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) { }

  @Post()
  @ApiOperation({ description: 'Create a new API key for a consumer' })
  @ApiResponse({ status: 201, type: ApiKeyCreatedDto })
  create(@Body() dto: CreateApiKeyDto, @Request() req: IUserRequest): Promise<ApiKeyCreatedDto> {
    return this.apiKeyService.create(dto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Revoke an API key' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  @ApiResponse({ status: 204, description: 'API key revoked' })
  revoke(@Param('id') id: string): Promise<boolean> {
    return this.apiKeyService.revoke(id);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete an API key' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  @ApiResponse({ status: 204, description: 'API key deleted' })
  delete(@Param('id') id: string): Promise<void> {
    return this.apiKeyService.delete(id);
  }
}
