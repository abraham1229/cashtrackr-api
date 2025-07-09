import { Router } from 'express' 
import { AuthController } from '../controllers/AuthController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'
import { authenticate } from '../middleware/auth'
 
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
    .isLength({min:6, max:6}).withMessage('Token is required'),
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

router.post('/validate-token',
  body('token')
    .notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token is required'),
  handleInputErrors,
  AuthController.validateToken
)

router.post('/reset-password/:token',
  param('token')
    .notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleInputErrors,
  AuthController.resetPasswordWithToken
)

router.get('/user',
  authenticate,
  AuthController.user
)

router.post('/update-password',
  authenticate,
  body('current_password')
    .notEmpty().withMessage('Current password is required'),
  body('new_password')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  handleInputErrors,
  AuthController.updatePassword
)

router.post('/check-password',
  authenticate,
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleInputErrors,
  AuthController.checkPassword
)

export default router