import AWS from 'aws-sdk'
import env from '@config/config'

AWS.config.update({ region: env.AWS_REGION })

export = AWS
