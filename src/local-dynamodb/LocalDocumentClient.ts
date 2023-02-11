import { DynamoDB } from 'aws-sdk'

type DynamoDBClientParams = ConstructorParameters<
  typeof DynamoDB.DocumentClient
>[number]

type GetDocumentClientParams = DynamoDBClientParams & {
  local: boolean
}

export function getDocumentClient(
  params?: GetDocumentClientParams,
): DynamoDB.DocumentClient {
  const endpoint = params?.local ? `http://dynamodb-local:8000` : undefined

  return new DynamoDB.DocumentClient({
    endpoint,
  })
}
