import { createRequest, createResponse } from 'node-mocks-http'
import { budgets } from "../mocks/budgets"
import { BudgetController } from '../../controllers/BudgetController'
import Budget from '../../models/Budget'
import Expense from '../../models/Expense'

//Mock the model
jest.mock('../../models/Budget', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn()
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

    //Check expected responses
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toStrictEqual({ error: 'Unexpected error' })
  })
})

describe('BudgetController.create', () => {
  it('Should create a new budget and respond with statucode 201', async () => {
    const mockBudget = {
      save: jest.fn().mockResolvedValue(true)
    };

    (Budget.create as jest.Mock).mockResolvedValue(mockBudget);

    //Create req and res
    const req = createRequest({
      method: 'POST',
      url: '/api/budgets', 
      user: { id: 1 },
      body: { 
        name: "Test budget",
        amount: 1000
      }
    })
    const res = createResponse();

    await BudgetController.create(req, res)


    //Check expected response
    const data = res._getJSONData()
    expect(res.statusCode).toBe(201)
    expect(data).toBe('Budget created')
    expect(mockBudget.save).toHaveBeenCalled()
    expect(mockBudget.save).toHaveBeenCalledTimes(1)
    expect(Budget.create).toHaveBeenCalledWith(req.body) 
  })

  it('Should handle budget creation error', async () => {
    const mockBudget = {
      save: jest.fn().mockResolvedValue(true)
    };

    (Budget.create as jest.Mock).mockRejectedValue(new Error);
    
    //Create req and res
    const req = createRequest({
      method: 'POST',
      url: '/api/budgets', 
      user: { id: 1 },
      body: { 
        name: "Test budget",
        amount: 1000
      }
    })
    const res = createResponse();

    await BudgetController.create(req, res)


    //Check expected response
    const data = res._getJSONData()

    expect(res.statusCode).toBe(500)
    expect(data).toEqual({ error: 'Unexpected error' })
    expect(mockBudget.save).not.toHaveBeenCalled()
    expect(Budget.create).toHaveBeenCalledWith(req.body) 
  })
})

describe('BudgetController.getById', () => {
  
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockReset();
    (Budget.findByPk as jest.Mock).mockImplementation(id => {
      const budget = budgets.filter(budget => budget.id === id)[0]
      return Promise.resolve(budget)
    })
  })

  it('Sould return a budget with ID 1 and 3 expenses', async () => {
    //Create req and res
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId',
      budget: { id: 1 }
    })
    const res = createResponse();

    //Call controller
    await BudgetController.getById(req, res)

    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(3)
    expect(Budget.findByPk).toHaveBeenCalledTimes(1)
    expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
      include: [Expense]
    })
  })

  it('Sould return a budget with ID 2 and 2 expenses', async () => {
    //Create req and res
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId', 
      budget: { id: 2}
    })
    const res = createResponse();

    //Call controller
    await BudgetController.getById(req, res)

    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(2)
  })

  it('Sould return a budget with ID 3 and 0 expenses', async () => {
    //Create req and res
    const req = createRequest({
      method: 'GET',
      url: '/api/budgets/:budgetId', 
      budget: { id: 3}
    })
    const res = createResponse();

    //Call controller
    await BudgetController.getById(req, res)

    const data = res._getJSONData()

    expect(res.statusCode).toBe(200)
    expect(data.expenses).toHaveLength(0)
  })
})