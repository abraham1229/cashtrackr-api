import { Request, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'
import Expense from '../models/Expense'

declare global {
  namespace Express {
    interface Request {
      expense?: Expense
    }
  }
}

export const validatExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
  await body('name').notEmpty().withMessage('Expense is required.')
    .run(req)

  await body('amount').notEmpty().withMessage('Amount is required.')
    .isNumeric().withMessage('Amount must be a number.')
    .custom(value => value > 0).withMessage('Amount must be greater than zero.')
    .run(req)

  next()
}

export const validatExpenseId = async (req: Request, res: Response, next: NextFunction) => {
  await param('expenseId').isInt().withMessage('ID must be an integer')
    .custom(value => value > 0).withMessage('ID must be greater than zero')
    .run(req)

  next()
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { expenseId } = req.params
    const expense = await Expense.findByPk(expenseId)

    if (!expense) {
      const error = new Error('Expense not found')
      return res.status(404).json({ error: error.message })
    }

    req.expense = expense

    next()
  } catch {
    res.status(500).json({ error: 'Unexpected error' })
  }
}