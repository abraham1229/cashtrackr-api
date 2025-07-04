import { type Request, type Response } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'

export class AuthController {
  static createAccount = async (req: Request, res: Response) => { 
    const { email, password } = req.body
    
    // Prevent duplicates
    const userExists = await User.findOne({where: {email: email}})

    if (userExists) {
      const error = new Error('The email is already in use')
      return res.status(409).json({error: error.message})
    }

    try {
      const user = new User(req.body)
      user.password = await hashPassword(password)
      user.token = generateToken()
      
      await user.save()

      //Send email
      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token
      })

      res.json('Account created successfully')

      
    } catch (error) {
      res.status(500).json({error: 'Unexpected error'})
    }
  }

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body

    const user = await User.findOne({ where: { token: token } })

    if (!user) {
      const error = new Error('Invalid token')
      return res.status(401).json({error: error.message})
    }

    user.confirmed = true
    user.token = null
    await user.save()
    res.json('Account confirmed successfully')
  }

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    
    //Checks if the use exists
    const user = await User.findOne({where: {email: email}})

    if (!user) {
      const error = new Error('User not found')
      return res.status(404).json({error: error.message})
    }

    //Check if account is not confirmed
    if (!user.confirmed) {
      const error = new Error('Account is not confirmed')
      return res.status(403).json({error: error.message})
    }

    //Check password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
      const error = new Error('Incorrect password')
      return res.status(401).json({error: error.message})
    }

    //Generate json web token
    const token = generateJWT(user.id)

    res.json(token)
    
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body
    
    //Checks if the use exists
    const user = await User.findOne({where: {email: email}})

    if (!user) {
      const error = new Error('User not found')
      return res.status(404).json({error: error.message})
    }

    //Check if account is not confirmed
    if (!user.confirmed) {
      const error = new Error('Account is not confirmed')
      return res.status(403).json({error: error.message})
    }

    //Generate token
    user.token = generateToken()
    await user.save()

    //Send email
    AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token
    })

    res.json('Recovery token sent via email')
  } 

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body

    const tokenExists = await User.findOne({ where: { token: token } })
    if (!tokenExists) {
      const error = Error('Incorrect token')
      return res.status(404).json({error: error.message})
    }

    res.json('Correct token')
  }

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params
    const { password } = req.body

    //Validate token
    const user = await User.findOne({ where: { token: token } })
    if (!user) {
      const error = Error('Incorrect token')
      return res.status(404).json({error: error.message})
    }

    // Save the new password
    user.password = await hashPassword(password)
    user.token = null
    await user.save()

    res.json('Password updated successfully')
  }

  static user = async (req: Request, res: Response) => { 
    res.json(req.user)
  }
}
