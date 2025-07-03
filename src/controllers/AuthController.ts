import { type Request, type Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'

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
}
