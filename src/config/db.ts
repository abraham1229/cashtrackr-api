import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}
export const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + '/../models/**/*'],
  logging: false,
  dialectOptions: {
    ssl: {
      require: false
    }
  }
})