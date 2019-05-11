import * as dynamoDbLib from "./../libs/dynamodb-lib";
import { success, failure } from "./../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: "users",
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user,
    KeyConditionExpression: "createdBy = :createdBy",
    ExpressionAttributeValues: {
      ":createdBy": event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    let orderByAge = JSON.parse(JSON.stringify(result.Items)).sort((a,b) => new Date(a.dob).getTime() - new Date(b.dob).getTime())
    let orderByLocation = JSON.parse(JSON.stringify(result.Items)).sort((a,b) => parseFloat(a.longitude) - parseFloat(b.longitude))
    let stats = {
      oldest: orderByAge[0],
      youngest: orderByAge[orderByAge.length-1],
      northernMost: orderByLocation[orderByLocation.length-1],
      southernMost: orderByLocation[0]
    }
    return success([result.Items, stats]);
  } catch (e) {
    return failure({ status: false });
  }
}

export async function statistic(event, context) {
  const params = {
    TableName: "users",
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    //   of the authenticated user,
    KeyConditionExpression: "createdBy = :createdBy",
    ExpressionAttributeValues: {
      ":createdBy": event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    
    let orderByAge = result.Items.sort((a,b) => new Date(a.dob).getTime() - new Date(b.dob).getTime())
    let orderByLocation = result.Items.sort((a,b) => parseFloat(a.longitude) - parseFloat(b.longitude))
    let stats = {
      oldest: orderByAge[0],
      youngest: orderByAge[orderByAge.length-1],
      northernMost: orderByLocation[orderByLocation.length-1],
      southernMost: orderByLocation[0]
    }
    
    return success(stats);
  } catch (e) {
    return failure({ status: false });
  }
}
