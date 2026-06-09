import { Controller, Post, Get, Patch, Param, Body, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './UserService';
import { CreateUserDto } from './Dtos/CreateUserDto';
import { UpdateUserDto } from './Dtos/UpdateUserDto';
import { GetUserDto } from './Dtos/GetUserDto';
import { AuthGuard } from '../Auth/AuthGuard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ description: 'Create a new user' })
  @ApiResponse({ status: 201, type: GetUserDto })
  create(@Body() dto: CreateUserDto): Promise<GetUserDto> {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ description: 'Get all users' })
  @ApiResponse({ status: 200, type: [GetUserDto] })
  findAll(): Promise<GetUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a user by ID' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update a user' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<GetUserDto> {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a user' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
