import colors from 'colors'
import server, { connectDB } from './server'

const port = process.env.PORT || 4000

async function startServer() {
  try {
    await connectDB()
    server.listen(port, () => {
      console.log(colors.cyan.bold(`REST API in port ${port}`))
    })
  } catch (error) {
    console.error(colors.red.bold('Failed to start server:'), error)
    process.exit(1)
  }
}

startServer()