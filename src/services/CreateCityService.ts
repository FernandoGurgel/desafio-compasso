import { City } from '@model/City'
import env from '@config/config'
import { DataMapper } from '@aws/dynamodb-data-mapper'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import { equals } from '@aws/dynamodb-expressions'
import { User } from '@model/User'

interface ICity {
  id: string,
  name: string,
  state: string
}

export class CreateCityService {
  mapper;

  constructor () {
    const client = new DynamoDB({ region: env.AWS_REGION })
    this.mapper = new DataMapper({ client })
  }

  async save ({ name, state }: ICity): Promise<any> {
    try {
      const city = new City()
      city.name = name
      city.state = state
      const responseDynamoDB = await this.mapper.put(city)
      return responseDynamoDB
    } catch (e) {
      throw new Error('erro ao salvar cidade')
    }
  }

  async findByNameCity ({ name }: ICity): Promise<any> {
    const listCity:City[] = []
    const iterator = this.mapper.scan(City, {
      filter: {
        ...equals(name),
        subject: 'name'
      }
    })

    for await (const item of iterator) {
      listCity.push(item)
    }

    return listCity
  }

  async findByNameState ({ name }: ICity): Promise<any> {
    const listCity:City[] = []
    const iterator = this.mapper.scan(City, {
      filter: {
        ...equals(name),
        subject: 'state'
      }
    })

    for await (const item of iterator) {
      listCity.push(item)
    }

    return listCity
  }

  async findAll () {
    const citys = []
    for await (const item of this.mapper.scan({ valueConstructor: City })) {
      citys.push(item)
    }
    return citys
  }
}
