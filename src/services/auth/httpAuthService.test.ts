import { HttpAuthService } from './httpAuthService';

describe('HttpAuthService', () => {
  it('login exitoso con contraseña 12345678 devuelve usuario y token', async () => {
    const service = new HttpAuthService();
    const { user, token } = await service.login({ email: 'test@example.com', password: '12345678' });
    expect(user.email).toBe('test@example.com');
    expect(typeof token).toBe('string');
    expect(token).toContain('mock_jwt_token_');
  });

  it('login falla con contraseña incorrecta', async () => {
    const service = new HttpAuthService();
    await expect(service.login({ email: 'test@example.com', password: 'wrong' }))
      .rejects
      .toThrow('Email o contraseña incorrectos.');
  });
});


