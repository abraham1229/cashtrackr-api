import type { Request, Response } from 'express'

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    console.log('Desde /api/budgets')
  }
  static create = async (req: Request, res: Response) => {
    console.log('post /api/budgets')
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