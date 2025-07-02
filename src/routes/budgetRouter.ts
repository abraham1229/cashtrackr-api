import { Router } from "express";
import { body, param } from "express-validator"
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExists, validatExpenseId, validatExpenseInput } from "../middleware/expense";

const router = Router()

//Middlewares for id
router.param('budgetId',validateBudgetId)
router.param('budgetId', handleInputErrors)
router.param('budgetId', validateBudgetExists)

//Middlewares for expense
router.param('expenseId', validatExpenseId)
router.param('expenseId', handleInputErrors)
router.param('expenseId', validateExpenseExists)

//Routes for budget
router.get('/',
  BudgetController.getAll
)

router.post('/',
  validateBudgetInput,
  handleInputErrors,
  BudgetController.create
)

router.get('/:budgetId',
  BudgetController.getById
)

router.put('/:budgetId',
  validateBudgetInput,
  handleInputErrors,
  BudgetController.updateById
)

router.delete('/:budgetId',
  BudgetController.deleteById
)

///Routes for expenses
router.post('/:budgetId/expenses',
  validatExpenseInput,
  handleInputErrors,
  ExpensesController.create
)
router.get('/:budgetId/expenses/:expenseId',
  ExpensesController.getById
)

router.put('/:budgetId/expenses/:expenseId',
  validatExpenseInput,
  handleInputErrors,
  ExpensesController.updateById
)

router.delete('/:budgetId/expenses/:expenseId',
  ExpensesController.deleteById
)

export default router