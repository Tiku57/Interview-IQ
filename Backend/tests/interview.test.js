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
                        response: { text: () => JSON.stringify({
                            title: "Mock Interview Prep",
                            matchScore: 90,
                            technicalQuestions: [],
                            behavioralQuestions: [],
                            skillGaps: [],
                            preparationPlan: []
                        })}
                    })
                })
            };
        })
    };
});

describe('Interview API', () => {
    const testUser = {
        username: 'testuser_interview',
        email: 'test_interview@example.com',
        password: 'password123'
    };
    let token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        
        token = res.body.token;
    });

    describe('POST /api/interview/', () => {
        it('should generate an interview report for an authenticated user', async () => {
            const res = await request(app)
                .post('/api/interview/')
                .set('Authorization', `Bearer ${token}`)
                .field('jobDescription', 'Frontend Engineer')
                .field('selfDescription', 'I am a full stack developer');
            
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('interviewReport');
            expect(res.body.interviewReport.title).toEqual('Mock Interview Prep');
        });

        it('should fail if no token is provided', async () => {
            const res = await request(app)
                .post('/api/interview/')
                .field('jobDescription', 'Frontend Engineer')
                .field('selfDescription', 'I am a full stack developer');
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toMatch(/You are not logged in/);
        });
    });
});
