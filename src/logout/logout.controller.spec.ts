import { Test, TestingModule } from '@nestjs/testing';
import { LoginRequest } from 'src/login/LoginRequest.types';
import { User } from 'src/users/users.service';
import { LogoutController } from './logout.controller';

describe('Logout Controller', () => {
  let controller: LogoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogoutController],
    }).compile();

    controller = module.get<LogoutController>(LogoutController);
  });

  it('should be defined', async () => {
    const mockUser: User = {
      id: 1,
      name: 'Lee',
    };
    expect(controller).toBeDefined();
    const result = await controller.logout({
      user: mockUser,
    } as LoginRequest);
    expect(result).toEqual({
      id: 0,
      name: '',
    });
  });
});
