import uuid from "uuid";
import * as dynamoDbLib from "./../libs/dynamodb-lib";
import { success, failure } from "./../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "users",
    Item: {
        id: data.id ? data.id : uuid(),
        firstName: data.name.first,
        lastName: data.name.last,
        email: data.email,
        age: data.dob.age,
        dob: data.dob.date,
        longitude: data.location.coordinates.longitude,
        latitude: data.location.coordinates.latitude,
        imgUrl:  data.picture.large,
        createdBy: event.requestContext.identity.cognitoIdentityId,
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
