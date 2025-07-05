import {createRequest, createResponse} from 'node-mocks-http'
import { hasAccess, validateBudgetExists } from '../../../middleware/budget'
import Budget from '../../../models/Budget'
import { budgets } from '../../mocks/budgets'

//Mock the model
jest.mock('../../../models/Budget', () => ({
  findByPk: jest.fn()
}))

describe('Budget Middleware - validateBudgetExists', () => {
  it('should handle non-existent budget', async () => {

    (Budget.findByPk as jest.Mock).mockResolvedValue(null)

    const req = createRequest({
      params: {
        budgetId: 1
      }
    })
    const res = createResponse()
    const next = jest.fn()

    await validateBudgetExists(req, res, next)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(404)
    expect(data).toEqual({ error: 'Budget not found' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should handle errors', async () => {

    (Budget.findByPk as jest.Mock).mockRejectedValue(new Error)

    const req = createRequest({
      params: {
        budgetId: 1
      }
    })
    const res = createResponse()
    const next = jest.fn()

    await validateBudgetExists(req, res, next)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(500)
    expect(data).toEqual({ error: 'Unexpected error' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should proceed to next middleware if budget exists', async () => {
    
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])

    const req = createRequest({
      params: {
        budgetId: 1
      }
    })
    const res = createResponse()
    const next = jest.fn()

    await validateBudgetExists(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.budget).toEqual(budgets[0])
  })
})

describe('Budget Middleware - hasAccess', () => {
  it('should handle not authorized users', async () => {

    const req = createRequest({
      budget: budgets[0],
      user: { id: 2 },
    })
    const res = createResponse()
    const next = jest.fn()

    hasAccess(req, res, next)

    const data = res._getJSONData()
    expect(res.statusCode).toBe(401)
    expect(data).toEqual({ error: 'Not authorized' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should proceed to next middleware if ids are equals', async () => {

    const req = createRequest({
      budget: budgets[0],
      user: { id: 1 },
    })
    const res = createResponse()
    const next = jest.fn()

    hasAccess(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })
})