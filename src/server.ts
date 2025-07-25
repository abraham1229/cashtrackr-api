import express from 'express'
import morgan from 'morgan'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'
import { db } from './config/db'

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync() //Crear tablas y columnas en automatico desde modelos
    // console.log(colors.blue.bold('Successfully connected to db'))
  } catch (error) {
    // console.log(colors.red.bold('Error connecting to db'))
  }
}

connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

//create routes
app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)

export default app