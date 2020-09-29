import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';


describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: {} },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('gets a token for a user on login', async () => {
    jest.spyOn(jwtService, 'sign').mockImplementation(x => JSON.stringify(x));
    const mockUser = { username: 'Lee', userId: 1 };
    const result = await service.login(mockUser);
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.userId,
      username: mockUser.username,
    });
    // eslint-disable-next-line @typescript-eslint/camelcase
    expect(result).toEqual({ access_token: '{"username":"Lee","sub":1}' });
  });
});
