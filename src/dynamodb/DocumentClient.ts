import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

type DynamoDBClientConfig = ConstructorParameters<typeof DynamoDBClient>

export function getDocumentClient(
  dynamoDBClientConfig: DynamoDBClientConfig,
  local = false,
): DynamoDBDocumentClient {
  const endpoint = local ? `http://dynamodb-local:8000` : undefined

  const ddbClient = new DynamoDBClient({ ...dynamoDBClientConfig, endpoint })
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient)

  return ddbDocClient
}
