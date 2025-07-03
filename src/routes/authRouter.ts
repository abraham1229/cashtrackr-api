import { Router } from 'express' 
import { AuthController } from '../controllers/AuthController'
import { body } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'
 

const router = Router()

router.use(limiter) //use groups all the request types

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

router.post('/login', 
  body('email')
    .isEmail().withMessage('Invalid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleInputErrors,
  AuthController.login
)

router.post('/forgot-password',
  body('email')
    .isEmail().withMessage('Invalid email'),
  handleInputErrors,
  AuthController.forgotPassword
)


export default router