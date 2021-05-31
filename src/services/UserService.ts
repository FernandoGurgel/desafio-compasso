import { User } from '@model/User'
import { City } from '@model/City'
import env from '@config/config'
import { DataMapper } from '@aws/dynamodb-data-mapper'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import { contains } from '@aws/dynamodb-expressions'

interface ICity {
  id: string,
  name: string,
  state: string
}

interface Iuser {
  id: string
  fullName: string
  gender: string
  birthday: string
  age: number,
  cityId?: string,
  city?: ICity
}

export class UserService {
  mapper;

  constructor () {
    const client = new DynamoDB({ region: env.AWS_REGION })
    this.mapper = new DataMapper({ client })
  }

  async getAllUser (): Promise<any[]> {
    try {
      const users = []
      for await (const item of this.mapper.scan({ valueConstructor: User })) {
        const city = new City()
        city.id = item.cityId
        const cityDynamo = await this.mapper.get(city)
        const user:Iuser = {
          age: item.getAge(),
          id: item.id,
          birthday: item.birthday,
          gender: item.gender,
          fullName: item.fullName,
          city: {
            id: cityDynamo.id,
            name: cityDynamo.name,
            state: cityDynamo.state
          }
        }
        users.push(user)
      }
      return users
    } catch (e) {
      throw new Error('Erro para consulta')
    }
  }

  async save ({ fullName, gender, birthday, cityId }: Iuser): Promise<User|undefined> {
    try {
      if (cityId) {
        const user = new User()
        user.fullName = fullName
        user.gender = gender
        user.birthday = birthday
        user.cityId = cityId
        const responseDynamoDB = await this.mapper.put(user)
        return responseDynamoDB
      }
      return undefined
    } catch (e) {
      throw new Error('Erro para consulta')
    }
  }

  async getById ({ id }:Iuser):Promise<Iuser> {
    try {
      const user = new User()
      user.id = id
      const responseFindByID = await this.mapper.get(user)
      const city = new City()
      city.id = responseFindByID.cityId
      const cityDynamo = await this.mapper.get(city)

      const response:Iuser = {
        id: responseFindByID.id,
        gender: responseFindByID.gender,
        fullName: responseFindByID.fullName,
        age: responseFindByID.getAge(),
        birthday: responseFindByID.birthday,
        city: {
          id: cityDynamo.id,
          name: cityDynamo.name,
          state: cityDynamo.state
        }
      }
      return response
    } catch (e) {
      throw new Error('Erro para consulta ' + id)
    }
  }

  async update ({ id, fullName }: Iuser): Promise<User|undefined> {
    try {
      const user = new User()
      user.id = id
      const responseFindByID = await this.mapper.get(user)

      responseFindByID.fullName = fullName

      const responseSave = await this.mapper.put(responseFindByID)

      return responseSave
    } catch (e) {
      throw new Error('Erro para consulta ' + id)
    }
  }

  async getByName ({ name }:any):Promise<any> {
    const listUser:User[] = []
    const iterator = this.mapper.scan(User, {
      filter: {
        ...contains(name),
        subject: 'fullName'
      }
    })

    for await (const item of iterator) {
      listUser.push(item)
    }

    return listUser
  }
}
