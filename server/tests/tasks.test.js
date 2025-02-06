const request = require('supertest');
const {app, connectDB} = require('../app');
const mongoose = require('mongoose');

describe('Task API', () => {
  let authToken;
  let taskId;

  beforeAll(async () => {
    await connectDB();
    await new Promise((resolve, reject) => {
      mongoose.connection.once('open', resolve);
      mongoose.connection.on('error', reject);
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'yourSecurePassword' });

    authToken = response.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 'To Do',
    };
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newTask);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Task');
    taskId = response.body._id;
  });

  it('should fetch all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update a task', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'In Progress' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('In Progress');
  });

  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
  });
});