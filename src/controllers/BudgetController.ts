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
    try {
      const { id } = req.params
      const budget = await Budget.findByPk(id)

      if (!budget) {
        const error = new Error('Budget not found')
        return res.status(404).json({error: error.message})
      }

      res.json(budget)
    } catch {
      res.status(500).json({error: 'Unexpected error'})
    }
  }
  static updateById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const budget = await Budget.findByPk(id)

      if (!budget) {
        const error = new Error('Budget not found')
        return res.status(404).json({error: error.message})
      }

      //update budget
      await budget.update(req.body)

      res.json('Budget updated succesfully')
    } catch {
      res.status(500).json({error: 'Unexpected error'})
    }
  }
  static deleteById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const budget = await Budget.findByPk(id)

      if (!budget) {
        const error = new Error('Budget not found')
        return res.status(404).json({error: error.message})
      }

      await budget.destroy()
      res.json('Budget deleted succesfully')
      
    } catch {
      res.status(500).json({error: 'Unexpected error'})
    }
  }
}