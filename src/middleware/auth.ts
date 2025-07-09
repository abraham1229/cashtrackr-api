import { NextFunction, type Request, type Response } from 'express'
import User from '../models/User'
import { decodeJWT } from '../utils/jwt'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    const error = Error('No authenticated')
    return res.status(401).json({error: error.message})
  }

  const token = bearer.split(' ')[1]

  if (!token) {
    const error = Error('Invalid token')
    return res.status(401).json({error: error.message})
  }

  try {
    const decoded = decodeJWT(token)
    if (typeof decoded === 'object' && decoded.id) {
      const user = await User.findByPk(decoded.id, {
        attributes: ['id','name','email']
      })

      req.user = user

      next()
    }
  } catch (error) {
    res.status(401).json({error: 'Invalid Token'})
  }
}