import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import env from '@config/config'
import cors from 'cors'
import routes from './routes'
import AppError from './errors/AppError'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api', routes)
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(env.PORT)
