const request = require('supertest');
const { app } = require('../app');
const Task = require("../models/tasks");

jest.mock("../models/tasks");

describe('Task API', () => {
  let authToken = "mock-auth-token";
  let taskId = "random-task-id-1";

  const todoTask = {
    _id: taskId,
    title: 'Test Task',
    description: 'This is a test task',
    status: 'To Do'
  };

  const inProgressTask = {
    _id: taskId,
    title: 'Test Task',
    description: 'This is a test task',
    status: 'In Progress'
  };

  beforeAll(async () => {
    Task.create.mockResolvedValue(todoTask);
    Task.find.mockResolvedValue([todoTask]);

    Task.findById.mockImplementation((id) => {
      if (id === taskId) {
        return Promise.resolve(todoTask);
      }
      return Promise.resolve(null);
    });

    Task.findByIdAndUpdate.mockResolvedValue(inProgressTask);
    Task.findByIdAndDelete.mockResolvedValue({ deletedCount: 1 });
  });

  it('should create a new task', async () => {
    const newTask = todoTask
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newTask);
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Task');
  });

  it('should return 400 if title or description is missing', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Incomplete Task' }); // Missing description
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Title and description are required');
  });

  it('should fetch all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  
  it('should fetch task by id', async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(taskId);
  });

  it('should return 404 if task does not exist when fetching by ID', async () => {
    Task.findById.mockResolvedValue(null);
    const randomTaskId = "1234";
    const response = await request(app)
      .get(`/api/tasks/${randomTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Task not found');
  });

  it('should update a task', async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'In Progress' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('In Progress');
  });


  it('should return 404 if task does not exist when updating', async () => {
    Task.findByIdAndUpdate.mockResolvedValue(null);
    const randomTaskId = "1234";
    const response = await request(app)
      .put(`/api/tasks/${randomTaskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'Completed' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Task not found');
  });


  it('should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
  });

  it('should return 404 if task does not exist when deleting', async () => {
    Task.findByIdAndDelete.mockResolvedValue(null);
    const randomTaskId = "1234";
    const response = await request(app)
      .delete(`/api/tasks/${randomTaskId}`)
      .set('Authorization', `Bearer ${authToken}`);
  
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Task not found');
  });
});