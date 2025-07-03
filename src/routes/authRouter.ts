import { Router } from 'express' 
import { AuthController } from '../controllers/AuthController'
import { body } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
 

const router = Router()

router.post('/create-account',
  body('name')
    .notEmpty().withMessage('Name is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('email')
    .isEmail().withMessage('Invalid email'),
  handleInputErrors,
  AuthController.createAccount
)

router.post('/confirm-account',
  body('token')
    .notEmpty().isLength({min:6, max:6}).withMessage('Token is required'),
  handleInputErrors,
  AuthController.confirmAccount
)


export default router