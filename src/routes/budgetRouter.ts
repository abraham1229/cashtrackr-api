import { Router } from "express";
import { body } from "express-validator"
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.get('/', BudgetController.getAll)
router.post('/',
  body('name').notEmpty().withMessage('Budget is required.'),
  body('amount').notEmpty().withMessage('Amount is required.')
    .isNumeric().withMessage('Amount must be a number.')
    .custom(value => value > 0).withMessage('Amount must be greater than zero.'),
  handleInputErrors,
  BudgetController.create)
router.get('/:id', BudgetController.getById)
router.put('/:id', BudgetController.updateById)
router.delete('/:id', BudgetController.deleteById)

export default router