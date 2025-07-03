import { type Request, type Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'

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
      res.json('Account created successfully')

      
    } catch (error) {
      res.status(500).json({error: 'Unexpected error'})
    }
  }
}
