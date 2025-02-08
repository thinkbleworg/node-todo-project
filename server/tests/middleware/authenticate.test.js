const authenticate = require('../../middleware/authenticate');
const { verifyToken } = require('../../utils/authUtils');

jest.mock('../../utils/authUtils');

describe('Authenticate Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: jest.fn() };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn(); //mock callback
  });

  it('should return 401 if no token is provided', () => {
    req.header.mockReturnValue(null);

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.header.mockReturnValue('Bearer invalidtoken');
    verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
    });

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if token is valid', () => {
    req.header.mockReturnValue('Bearer validtoken');
    verifyToken.mockReturnValue({ id: '1', email: 'test@example.com' });

    authenticate(req, res, next);

    expect(req.user).toEqual({ id: '1', email: 'test@example.com' });
    expect(next).toHaveBeenCalled();
  });
});
