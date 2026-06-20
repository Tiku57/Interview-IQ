const request = require('supertest');
const app = require('../src/app');

// Mock external services to prevent errors during tests
jest.mock('@google/generative-ai', () => {
    return {
        SchemaType: {
            STRING: "STRING",
            NUMBER: "NUMBER",
            INTEGER: "INTEGER",
            BOOLEAN: "BOOLEAN",
            ARRAY: "ARRAY",
            OBJECT: "OBJECT"
        },
        GoogleGenerativeAI: jest.fn().mockImplementation(() => {
            return {
                getGenerativeModel: jest.fn().mockReturnValue({
                    generateContent: jest.fn().mockResolvedValue({
                        response: { text: () => "mock" }
                    })
                })
            };
        })
    };
});

describe('Auth API', () => {
    const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', testUser.email);
        });

        it('should fail with validation error for missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'test' });
            
            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toMatch(/Validation Error/);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send(testUser);
        });

        it('should login an existing user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toMatch(/Invalid email or password/);
        });
    });
});
