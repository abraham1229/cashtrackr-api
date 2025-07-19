import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { hasAccess, validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { belongsToBudget, validateExpenseExists, validatExpenseId, validatExpenseInput } from "../middleware/expense";
import { authenticate } from "../middleware/auth";

const router = Router()

router.use(authenticate)

/*MIDDLEWARES*/
//Middlewares for id
router.param('budgetId',validateBudgetId)
router.param('budgetId', handleInputErrors)
router.param('budgetId', validateBudgetExists)
router.param('budgetId', hasAccess)

//Middlewares for expense
router.param('expenseId', validatExpenseId)
router.param('expenseId', handleInputErrors)
router.param('expenseId', validateExpenseExists)
router.param('expenseId', belongsToBudget)

/*ROUTES*/
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