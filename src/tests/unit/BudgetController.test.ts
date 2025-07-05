import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from "../mocks/budgets"
import { BudgetController } from '../../controllers/BudgetController'
import Budget from '../../models/Budget'

//Mock the model
jest.mock('../../models/Budget', () => ({
  findAll: jest.fn()
}))

describe('BudgetController.getAll', () => {
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudgets = budgets.filter(budgets => budgets.userId === options.where.userId);
      return Promise.resolve(updatedBudgets)
    })
  })

  it('should retrieve 2 budgets for user with ID 1', async () => {
    //Create req and res
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets', 
      user: { id: 1}
    })
    const res = createResponse();

    //Call controller
    await BudgetController.getAll(req, res)
    
    //Check expected respones
    const data = res._getJSONData()
    expect(data).toHaveLength(2)
    expect(res.statusCode).toBe(200)
    expect(res.statusCode).not.toBe(404)
  })

  it('should retrieve 1 budget for user with ID 2', async () => {
    //Create req and res
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets', 
      user: { id: 2}
    })
    const res = createResponse();

    //Call controller
    await BudgetController.getAll(req, res)
    
    //Check expected respones
    const data = res._getJSONData()
    expect(data).toHaveLength(1)
    expect(res.statusCode).toBe(200)
    expect(res.statusCode).not.toBe(404)
  })

  it('should retrieve 0 budgets for user with ID 500', async () => {
    //Create req and res
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets', 
      user: { id: 500}
    })
    const res = createResponse();

    //Call controller
    await BudgetController.getAll(req, res)
    
    //Check expected respones
    const data = res._getJSONData()
    expect(data).toHaveLength(0)
    expect(res.statusCode).toBe(200)
    expect(res.statusCode).not.toBe(404)
  })

  it('should handle erros when fetching budgets', async () => {
    //Create req and res
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets', 
      user: { id: 500}
    })
    const res = createResponse();

    //Call controller
    (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
    await BudgetController.getAll(req, res)

    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toStrictEqual({ error: 'Unexpected error' })
  })
})