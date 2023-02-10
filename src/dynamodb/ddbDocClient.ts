import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { ddbClient } from './ddbClient'

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)

export { ddbDocClient }
