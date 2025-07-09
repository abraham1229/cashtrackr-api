import { Request, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'
import Budget from '../models/Budget'

declare global {
  namespace Express {
    interface Request {
      budget?: Budget
    }
  }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
  await param('budgetId').isInt().withMessage('ID must be an integer').bail()
    .custom(value => value > 0).withMessage('ID must be greater than zero').bail()
    .run(req)

  next()
}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { budgetId } = req.params
    const budget = await Budget.findByPk(budgetId)

    if (!budget) {
      const error = new Error('Budget not found')
      return res.status(404).json({ error: error.message })
    }

    req.budget = budget

    next()
  } catch {
    res.status(500).json({ error: 'Unexpected error' })
  }
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
  await body('name').notEmpty().withMessage('Budget is required')
    .run(req)

  await body('amount').notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number')
    .custom(value => value > 0).withMessage('Amount must be greater than zero')
    .run(req)

  next()
}

export const hasAccess = (req: Request, res: Response, next: NextFunction) => { 
  const { budget, user } = req

  if (budget.userId !== user.id) {
    const error = new Error('Not authorized')
    return res.status(401).json({error: error.message})
  }

  next()
}
