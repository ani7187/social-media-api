import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            refreshAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return an access token on successful login', async () => {
      const mockUser = { email: 'test@example.com', password: 'password' };
      const mockToken = { access_token: 'mockAccessToken' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockToken);

      const result = await authController.signIn(mockUser);
      expect(result).toEqual(mockToken);
      expect(authService.signIn).toHaveBeenCalledWith(mockUser.email, mockUser.password);
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token when refresh token is valid', async () => {
      const mockRefreshToken = 'valid_refresh_token';
      const mockNewToken = { access_token: 'newAccessToken' };
      jest.spyOn(authService, 'refreshAccessToken').mockResolvedValue(mockNewToken);

      const result = await authController.refreshToken({ refresh_token: mockRefreshToken });
      expect(result).toEqual(mockNewToken);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(mockRefreshToken);
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const mockRefreshToken = 'invalid_refresh_token';
      jest.spyOn(authService, 'refreshAccessToken').mockRejectedValue(new Error());

      await expect(authController.refreshToken({ refresh_token: mockRefreshToken }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
