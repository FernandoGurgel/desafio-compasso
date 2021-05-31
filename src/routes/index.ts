import { Router } from 'express'
import cityRouter from './City.routes'
import userRoutes from './User.routes'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/citys', cityRouter)

export default routes
