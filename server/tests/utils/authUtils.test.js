const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('../../utils/authUtils');

jest.mock('jsonwebtoken');

describe('Auth Utils', () => {
  const userId = '1';
  const mockToken = 'mocked.jwt.token';
  const secretKey = 'test-secret-key';

  beforeAll(() => {
    process.env.JWT_SECRET_KEY = secretKey;
  });

  afterAll(() => {
    delete process.env.JWT_SECRET_KEY;
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      jwt.sign.mockReturnValue(mockToken);

      const token = generateToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith({ sub: userId }, secretKey, { expiresIn: '1h' });
      expect(token).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should return decoded payload for a valid token', () => {
      const mockDecoded = { sub: userId };
      jwt.verify.mockReturnValue(mockDecoded);

      const decoded = verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, secretKey);
      expect(decoded).toEqual(mockDecoded);
    });

    it('should return null for an invalid token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const decoded = verifyToken('invalid.token');

      expect(jwt.verify).toHaveBeenCalledWith('invalid.token', secretKey);
      expect(decoded).toBeNull();
    });
  });
});
