import { Router } from 'express'
import { UserService } from '@services/UserService'
// import { CreateUserService } from '@services/CreateUserService'

const userRoutes = Router()

userRoutes.put('/:id', async (request, response) => {
  const { fullName } = request.body
  const { id } = request.params
  const user = new UserService()
  const responseUser = await user.update({ id, fullName })
  return response.status(200).json({ user: responseUser })
})

userRoutes.post('/', async (request, response) => {
  const { fullName, gender, birthday, cityId } = request.body
  const user = new UserService()
  const responseUser = await user.save({ fullName, gender, birthday, cityId })
  return response.status(200).json({ user: responseUser })
})

userRoutes.get('/', async (request, response) => {
  const service = new UserService()
  const users = await service.getAllUser()
  return response.status(200).json({ users: users })
})

userRoutes.get('/:id', async (request, response) => {
  const { id } = request.params
  const service = new UserService()
  const user = await service.getById({ id })
  return response.status(200).json({ user })
})

export default userRoutes
