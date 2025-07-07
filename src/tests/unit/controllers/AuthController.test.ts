import { createResponse, createRequest } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";

jest.mock("../../../models/User") //Automate mocking

describe('AuthController.createAccount', () => {
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
})