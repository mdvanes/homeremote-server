import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/users.service';
import { AuthService } from '../auth/auth.service';
import { LoginController } from './login.controller';

describe('Login Controller', () => {
  let controller: LoginController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      // to load the service with real implementation, use: providers: [AuthService],
      providers: [{ provide: AuthService, useValue: { login: jest.fn() } }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    controller = module.get<LoginController>(LoginController);
  });

  it('/GET a static login page', async () => {
    expect(await controller.getLoginPage()).toContain('<title>Login</title>');
  });

  it('/POST returns a token for a user', async () => {
    const mockUser: User = {
      id: 1,
      name: 'Lee',
    };

    // eslint-disable-next-line @typescript-eslint/camelcase
    const mockLoginResponse = { access_token: 'my_fake_access_token' };

    jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

    const result = await controller.login({
      user: mockUser,
    });

    expect(authService.login).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockLoginResponse);
  });
});
