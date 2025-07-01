import type { Request, Response } from 'express'
import Budget from '../models/Budget'

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const budgets = await Budget.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        //TODO: filter by authenticats user
      })
      
      res.json(budgets)
    } catch {
      res.status(500).json({error: 'Unexpected error'})
    }
  }
  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body)
      await budget.save()
      res.status(201).json('Budget created')
    } catch {
      res.status(500).json({error: 'Unexpected error'})
    }
  }
  static getById = async (req: Request, res: Response) => {
    console.log('By id desde get /api/budgets')
  }
  static updateById = async (req: Request, res: Response) => {
    console.log('By id desde update /api/budgets')
  }
  static deleteById = async (req: Request, res: Response) => {
    console.log('By id desde delete /api/budgets')
  }
}