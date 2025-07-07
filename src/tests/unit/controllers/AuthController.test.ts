import { createResponse, createRequest } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { checkPassword, hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../../../utils/jwt";

jest.mock("../../../models/User") //Automate mocking
jest.mock("../../../utils/auth")
jest.mock("../../../utils/token")
jest.mock("../../../utils/jwt")

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

describe('AuthController.login', () => { 

  it('should return 404 if user is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null)
    
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'test@test.com',
        password: 'testpassword'
      }
    })
    const res = createResponse()

    await AuthController.login(req, res)
    
    const data = res._getJSONData()
    expect(res.statusCode).toBe(404)
    expect(data).toEqual({ error: 'User not found' })
  })

  it('should return 403 if account is not confirmed', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'tes@test.com',
      password: 'password',
      confirmed: false //Account is not confirmed
    })
    
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'test@test.com',
        password: 'testpassword'
      }
    })
    const res = createResponse()

    await AuthController.login(req, res)
    
    const data = res._getJSONData()
    expect(res.statusCode).toBe(403)
    expect(data).toEqual({ error: 'Account is not confirmed' })
  })

  it('should return 401 if password is incorrect', async () => {

    const userMock = {
      id: 1,
      email: 'tes@test.com',
      password: 'hashed_password',
      confirmed: true
    };
    
    (User.findOne as jest.Mock).mockResolvedValue(userMock)


    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'test@test.com',
        password: 'password'
      }
    })
    const res = createResponse();

    (checkPassword as jest.Mock).mockResolvedValue(false);

    await AuthController.login(req, res)
    
    const data = res._getJSONData()
    expect(res.statusCode).toBe(401)
    expect(data).toEqual({ error: 'Incorrect password' })
    expect(checkPassword).toHaveBeenCalledWith(req.body.password, userMock.password)
    expect(checkPassword).toHaveBeenCalledTimes(1)
  })

  it('should return a JWT if auth is successful', async () => {

    const userMock = {
      id: 1,
      email: 'tes@test.com',
      password: 'hashed_password',
      confirmed: true
    };
    
    const req = createRequest({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'test@test.com',
        password: 'passoword'
      }
    })
    const res = createResponse();

    const fakejwt = 'fake_json';

    (User.findOne as jest.Mock).mockResolvedValue(userMock);
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue(fakejwt); //it is return cause is NOT async

    await AuthController.login(req, res)
    
    const data = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(data).toEqual(fakejwt)
    expect(generateJWT).toHaveBeenCalledTimes(1)
    expect(generateJWT).toHaveBeenCalledWith(userMock.id)
  })
})