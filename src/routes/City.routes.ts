import { Router } from 'express'
import { CityService } from '@services/CityService'
// import { CreateUserService } from '@services/CreateUserService'

const cityRouter = Router()

cityRouter.post('/', async (request, response) => {
  const { name, state } = request.body
  const city = new CityService()
  const save = await city.save({ name, state })
  return response.status(200).json({ city: save })
})

cityRouter.get('/nameCity', async (request, response) => {
  const { nameCity } = request.query
  const city = new CityService()
  const save = await city.findByNameCity({ name: nameCity })
  return response.status(200).json({ city: save })
})

cityRouter.get('/nameState', async (request, response) => {
  const { nameState } = request.query
  const city = new CityService()
  const save = await city.findByNameState({ name: nameState })
  return response.status(200).json({ city: save })
})

cityRouter.get('/', async (request, response) => {
  const city = new CityService()
  const save = await city.findAll()
  return response.status(200).json({ city: save })
})

export default cityRouter
