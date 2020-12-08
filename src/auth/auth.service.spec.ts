import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginRequest } from 'src/login/LoginRequest.types';
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

  it('gets a token for a user on login', async () => {
    jest.spyOn(jwtService, 'sign').mockImplementation(x => JSON.stringify(x));
    const mockUser: LoginRequest["user"] = { id: 1, name: 'lee', displayName: "Stan" };
    const result = service.getCookieWithJwtToken(mockUser);
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      username: mockUser.name,
    });
    expect(result).toEqual(["Authentication", "{\"sub\":1,\"username\":\"lee\"}", {"httpOnly": true, "maxAge": 2592000000, "path": "/"}]);
  });
});
