import { createResponse, createRequest } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";

jest.mock("../../../models/User") //Automate mocking
jest.mock("../../../utils/auth")
jest.mock("../../../utils/token")

describe('AuthController.createAccount', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
  })
  
  it('should return a 409 status and an error message if the email is already registerd', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true)
    
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/create-account',
      body: {
        email: 'test@test.com',
        password: 'testpassword'
      }
    })
    const res = createResponse()

    await AuthController.createAccount(req, res)
    
    const data = res._getJSONData()
    expect(res.statusCode).toBe(409)
    expect(data).toHaveProperty('error', 'The email is already in use')
    expect(User.findOne).toHaveBeenCalled()
    expect(User.findOne).toHaveBeenCalledTimes(1)
  })

  it('should register new user and return a success message', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null)
    
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/create-account',
      body: {
        name: 'testname',
        email: 'test@test.com',
        password: 'testpassword'
      }
    })
    const res = createResponse();

    const mockUser = { ...req.body, save: jest.fn() };
    const testHashedPW = 'hashedpassword'; 
    const testToken = '123456';

    (User.create as jest.Mock).mockResolvedValue(mockUser);
    (hashPassword as jest.Mock).mockResolvedValue(testHashedPW);
    (generateToken as jest.Mock).mockReturnValue(testToken);
    jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

    await AuthController.createAccount(req, res)

    expect(User.create).toHaveBeenCalledWith(req.body)
    expect(User.create).toHaveBeenCalledTimes(1)
    expect(mockUser.save).toHaveBeenCalledTimes(1)  
    expect(mockUser.password).toBe(testHashedPW)
    expect(mockUser.token).toBe(testToken)
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalled()
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1)
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
      name: req.body.name,
      email: req.body.email,
      token: testToken
    })
    expect(res.statusCode).toBe(201)
  })
})