import { Express } from "express";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { generateBasicAuthToken } from "../generateBasicAuthToken";
import { userDto } from "./userDto";
import { USERS_PATH } from "../../../src/modules/users/constants/users.paths";
import { UserInputModel } from "../../../src/modules/users/api/input/dto/userInputModel";
import { UserViewModel } from "../../../src/modules/users/api/output/userViewModel";

export const createUserDto = async (
  app: Express,
  inputForUser?: UserInputModel,
): Promise<UserViewModel> => {
    const testUserData: UserInputModel = { ...userDto(), ...inputForUser };

  const createdUserResponse = await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testUserData)
    .expect(httpStatuses.Created);

  return createdUserResponse.body;
};
