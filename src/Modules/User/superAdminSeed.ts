import { UserService } from './UserService';
import { UserType } from '../../Common/Enums/UserType';
import { NotFoundException } from '@nestjs/common';
import { Status } from '../../Common/Enums/Status';

export async function createSuperAdmin(userService: UserService) {
  const superAdminData = {
    fullName: process.env.SUPER_ADMIN_NAME || 'Super Admin',
    email: process.env.SUPER_ADMIN_EMAIL || 'admin@email.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
    userType: UserType.SUPER_ADMIN,
    status: Status.Active
  };

  try {
    await userService.findByEmail(superAdminData.email);
  } catch (error) {
    if (error instanceof NotFoundException) {
      await userService.create(superAdminData);
    } else {
      throw error;
    }
  }
} 