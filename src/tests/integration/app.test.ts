import request from 'supertest'
import server, { connectDB } from '../../server'
import { AuthController } from '../../controllers/AuthController'

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

  it('should return 201 when body is valid', async () => {

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



})