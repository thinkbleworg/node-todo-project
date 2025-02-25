const request = require('supertest');
const {app} = require('../app');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

jest.mock('../models/users');

describe('Authentication API', () => {

  const userObject = {
    _id: 'mock-user-id',
    email: 'testuser@example.com',
    password: bcrypt.hashSync('yourSecurePassword', 10)
  };

  beforeEach(() => {
    jest.clearAllMocks();

    User.findOne.mockImplementation(async (query) => {
      if (query.email === 'testuser@example.com') {
        return Promise.resolve(userObject);
      }
      return Promise.resolve(null);
    });

    User.prototype.save = jest.fn().mockResolvedValue({
      _id: 'mockUserId123',
      email: 'newuser4@example.com',
      password: 'password123',
    });

  
  });

  // Tests for register
  it('should register a new user and return a JWT token', async () => {
    const newUser = {
      email: 'newuser4@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  it('should return 400 if the email is already taken', async () => {
    const existingUser = {
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should return 400 if the password is too weak', async () => {
    const weakPasswordUser = {
      email: 'weakpassword1@example.com',
      password: '123',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(weakPasswordUser);

    expect(response.status).toBe(400); 
    expect(response.body.message).toBe('Password is too weak');
  });

  it('should return 500 if an error occurs during registration', async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save.mockRejectedValue(new Error('Database error'));  
  
    const newUser = {
      email: 'somerandomuser0000@example.com',
      password: 'password123',
    };
  
    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);
  
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error during user registration');
  });

  // Test for login
  it('should login a user and return a JWT token', async () => {
    
    const userCredentials = {
      email: 'testuser@example.com',
      password: 'yourSecurePassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(userCredentials);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should return 400 if the credentials are incorrect', async () => {
    const invalidCredentials = {
      email: 'testuser@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(invalidCredentials);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return 404 if the user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    const nonExistentUser = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(nonExistentUser);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  it('should return 500 if any other error while logging in', async () => {
    User.findOne.mockRejectedValue(new Error('Database error'));

    const userCredentials = {
      email: 'testuser@example.com',
      password: 'yourSecurePassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(userCredentials);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error logging in');
  });
});