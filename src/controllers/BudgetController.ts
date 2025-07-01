import { request, type Request, type Response } from 'express'
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
    res.json(req.budget)
  }

  static updateById = async (req: Request, res: Response) => {
    await req.budget.update(req.body)
    res.json('Budget updated succesfully')
  }

  static deleteById = async (req: Request, res: Response) => {
    await req.budget.destroy()
    res.json('Budget deleted succesfully')
  }
}