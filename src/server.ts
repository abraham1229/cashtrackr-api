import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from './routes/budgetRouter'

async function connectDB() {
  try {
    await db.authenticate()
    db.sync() //Crear tablas y columnas en automatico
    console.log(colors.blue.bold('Succesfully connected to db'))
  } catch (error) {
    // console.log(error)
    console.log(colors.red.bold('Error connecting to db'))
  }
}

connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())

//create routes
app.use('/api/budgets', budgetRouter)

export default app