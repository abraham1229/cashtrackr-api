import { Request, Response, NextFunction } from 'express'
import { body, param } from 'express-validator'

export const validatExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
  await body('name').notEmpty().withMessage('Expense is required.')
    .run(req)

  await body('amount').notEmpty().withMessage('Amount is required.')
    .isNumeric().withMessage('Amount must be a number.')
    .custom(value => value > 0).withMessage('Amount must be greater than zero.')
    .run(req)

  next()
}