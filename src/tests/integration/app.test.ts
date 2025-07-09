import request from 'supertest'
import server from '../../server'
import { AuthController } from '../../controllers/AuthController'
import User from '../../models/User'
import * as authUtils from '../../utils/auth'
import * as jwtUtils from '../../utils/jwt'

describe('Authentication - Create Account', () => {

  it('should display validation errors when form is empty', async () => {
    const response = await request(server)
      .post('/api/auth/create-account')
      .send({})
    
    const createAccountMock = jest.spyOn(AuthController, 'createAccount')
    
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(3)
    expect(response.statusCode).not.toBe(201)
    expect(createAccountMock).not.toHaveBeenCalled()
  })

  it('should return 400 when the email is invalid', async () => {
    const response = await request(server)
      .post('/api/auth/create-account')
      .send({
        "name": "Abraham",
        "password": "12345678",
        "email": "email_not_valid"
      })
    
    const createAccountMock = jest.spyOn(AuthController, 'createAccount')
    
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe("Invalid email")
    expect(response.statusCode).not.toBe(201)
    expect(createAccountMock).not.toHaveBeenCalled()
  })

  it('should return 400 when the password is invalid', async () => {
    const response = await request(server)
      .post('/api/auth/create-account')
      .send({
        "name": "Abraham",
        "password": "1234",
        "email": "email@email.com"
      })
    
    const createAccountMock = jest.spyOn(AuthController, 'createAccount')
    
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe("Password must be at least 8 characters")
    expect(response.statusCode).not.toBe(201)
    expect(createAccountMock).not.toHaveBeenCalled()
  })

  it('should return 400 when the name is invalid', async () => {
    const response = await request(server)
      .post('/api/auth/create-account')
      .send({
        "name": "",
        "password": "12345678",
        "email": "email@email.com"
      })
    
    const createAccountMock = jest.spyOn(AuthController, 'createAccount')
    
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe("Name is required")
    expect(response.statusCode).not.toBe(201)
    expect(createAccountMock).not.toHaveBeenCalled()
  })

  it('should register a new user successfully when the body is valid', async () => {

    const userData = {
        "name": "Abraham Ortiz",
        "password": "12345678",
        "email": "email@email.com"
      }

    const response = await request(server)
      .post('/api/auth/create-account')
      .send(userData)
    
    expect(response.statusCode).toBe(201)
    expect(response.body).not.toHaveProperty('errors')
  })

  it('should return 409 conflict when a user is already registered', async () => {

    const userData = {
        "name": "Abraham Ortiz",
        "password": "12345678",
        "email": "email@email.com"
      }

    const response = await request(server)
      .post('/api/auth/create-account')
      .send(userData)
    
    expect(response.statusCode).toBe(409)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('The email is already in use')
    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('Authentication - Account Confirmation with token', () => {

  it('should display error if token is empty or is not valid', async () => {
    const response = await request(server)
      .post('/api/auth/confirm-account')
      .send({
        token: "not_valid"
      })
    
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Token is required')
  })

  it('should display error if token is empty or is not valid', async () => {
    const response = await request(server)
      .post('/api/auth/confirm-account')
      .send({
        token: "123456"
      })
    
    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Invalid token')
    expect(response.status).not.toBe(200)
  })

  it('should confirm account with a valid token', async () => {
    const token = globalThis.cashTrackrConfirmationToken // from the global variable
    const response = await request(server)
      .post('/api/auth/confirm-account')
      .send({
        token: token
      })
    
    
    expect(response.status).toBe(200)
    expect(response.body).toBe('Account confirmed successfully')
  })
})

describe('Authentication - Login', () => { 

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return validation errors when the form is empty', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        "email":"",
        "password":""
      })
    
    const loginMock = jest.spyOn(AuthController, 'login')
    
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(2)
    expect(response.body.errors[0].msg).toBe('Invalid email')
    expect(response.body.errors[1].msg).toBe('Password is required')
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('should return 400 bad request when the email is invalid', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        "email":"emailNotValid",
        "password":"password"
      })
    
    const loginMock = jest.spyOn(AuthController, 'login')
    
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Invalid email')
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('should return 404 when the user does NOT exist', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        "email":"test@test.com",
        "password":"password"
      })
    
    expect(response.status).toBe(404)
    expect(response.status).not.toBe(200)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('User not found')
  })

  it('should return 403 when the user account is not confirmed', async () => {

    (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
      id: 1,
      confirmed: false,
      password: 'hashedPassword',
      email: 'user_not_confirmed@test.com'
    })


    const response = await request(server)
      .post('/api/auth/login')
      .send({
        "email":"user_not_confirmed@test.com",
        "password":"password"
      })
    
    expect(response.status).toBe(403)
    expect(response.status).not.toBe(200)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Account is not confirmed')
  })

  it('should return 403 when the user account is not confirmed', async () => {

    const userData = {
      name: "Test",
      email: "user_not_confirmed@test.com",
      password: "password"
    }

    //Crate user
    await request(server).post('/api/auth/create-account').send(userData)

    const response = await request(server)
      .post('/api/auth/login')
      .send({
        "email": userData.email,
        "password": userData.password
      })
    
    expect(response.status).toBe(403)
    expect(response.status).not.toBe(200)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Account is not confirmed')
  })

  
  it('should return 401 when the user password is incorrect', async () => {

    const findOneMock = (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
      id: 1,
      confirmed: true,
      password: 'hashedPassword',
      email: 'user_incorrect_password@test.com'
    })

    const checPasswordMock = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false)


    const response = await request(server)
      .post('/api/auth/login')
      .send({
        "email":"user_incorrect_password@test.com",
        "password":"wrong_password"
      })
    
    expect(response.status).toBe(401)
    expect(response.status).not.toBe(200)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('Incorrect password')
    expect(findOneMock).toHaveBeenCalledTimes(1)
    expect(checPasswordMock).toHaveBeenCalledTimes(1)
  })
  
  it('should return 200 when everything goes good and a JWT', async () => {

    const userIdTest = 500
    const jwtTest = 'jwtTest'
    const hashedPasswordTest = 'hashedPassword'
    const bodyPasswordTest = 'correctPassword'

    const findOneMock = (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
      id: userIdTest,
      confirmed: true,
      password: hashedPasswordTest,
      email: 'user_incorrect_password@test.com'
    })

    const checPasswordMock = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true)

    const generateJWTMock = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue(jwtTest)

    const response = await request(server)
      .post('/api/auth/login')
      .send({
        "email":"user_incorrect_password@test.com",
        "password":bodyPasswordTest
      })
    
    expect(response.status).toBe(200)
    expect(response.body).toBe(jwtTest)
    expect(findOneMock).toHaveBeenCalledTimes(1)
    expect(checPasswordMock).toHaveBeenCalledTimes(1)
    expect(checPasswordMock).toHaveBeenCalledWith(bodyPasswordTest, hashedPasswordTest)
    expect(generateJWTMock).toHaveBeenCalledTimes(1)
    expect(generateJWTMock).toHaveBeenCalledWith(userIdTest)
  })
})

//Authenticate
let jwt: string
async function authenticateUser() {
  // Get the JWT on before all
  const response = await request(server)
    .post('/api/auth/login')
    .send({
      email: "email@email.com",
      password: "12345678"
    })
  
  jwt = response.body

  expect(response.status).toBe(200)
}

describe('GET /api/budgets', () => {

  beforeAll(() => {
    jest.restoreAllMocks() //Restore the function to its original implementation
  })

  beforeAll(async () => {
    // Get the JWT on before all
    await authenticateUser()
  })
  
  it('should reject unauthenticated acces to budgets without a jwt', async () => {
    const response = await request(server)
      .get('/api/budgets')
    
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('No authenticated')
  })
  
  it('should reject incorrect jwt with 401 ', async () => {
    const response = await request(server)
      .get('/api/budgets')
      .auth('not_valid', {type: "bearer"})
    
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Invalid Token')
  })
  
  it('should allow authenticated users to get budgets', async () => {
    const response = await request(server)
      .get('/api/budgets')
      .auth(jwt, {type: "bearer"})
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(0)
  })
})

describe('POST /api/budgets', () => {

  beforeAll(async () => {
    authenticateUser()
  })

  it('should reject creating a budget without a jwt', async () => {
    const response = await request(server)
      .post('/api/budgets')
    
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('No authenticated')
  })

  it('should reject creating a budget with incorrect body', async () => {
    const response = await request(server)
      .post('/api/budgets')
      .auth(jwt, {type: "bearer"})
      .send({
        name: "",
        amount: ""
      })
    
    console.log(response.body.errors)
    expect(response.status).toBe(400)
    expect(response.body.errors[0].msg).toBe('Budget is required')
    expect(response.body.errors[1].msg).toBe('Amount is required')
    expect(response.body.errors[2].msg).toBe('Amount must be a number')
    expect(response.body.errors[3].msg).toBe('Amount must be greater than zero')
    expect(response.body.errors).toHaveLength(4)
  })

  it('should create a new budget and return a success message', async () => {
    const response = await request(server)
      .post('/api/budgets')
      .auth(jwt, {type: "bearer"})
      .send({
        name: "Budget test",
        amount: "5000"
      })
    
    expect(response.status).toBe(201)
    expect(response.body).toBe('Budget created')
  })
})