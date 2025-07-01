import { Router } from "express";
import { body, param } from "express-validator"
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetId } from "../middleware/budget";

const router = Router()

router.get('/', BudgetController.getAll)

router.post('/',
  body('name').notEmpty().withMessage('Budget is required.'),
  body('amount').notEmpty().withMessage('Amount is required.')
    .isNumeric().withMessage('Amount must be a number.')
    .custom(value => value > 0).withMessage('Amount must be greater than zero.'),
  handleInputErrors,
  BudgetController.create
)

router.get('/:id',
  validateBudgetId,
  validateBudgetExists,
  BudgetController.getById
)

router.put('/:id',
  validateBudgetId,
  validateBudgetExists,
  body('name').notEmpty().withMessage('Budget is required.'),
  body('amount').notEmpty().withMessage('Amount is required.')
    .isNumeric().withMessage('Amount must be a number.')
    .custom(value => value > 0).withMessage('Amount must be greater than zero.'),
  handleInputErrors,
  BudgetController.updateById
)

router.delete('/:id',
  validateBudgetId,
  validateBudgetExists,
  BudgetController.deleteById
)

export default router