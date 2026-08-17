import { Express } from "express";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { generateBasicAuthToken } from "../generateBasicAuthToken";
import { UserInputModel } from "../../../src/users/input/dto/userInputModel";
import { UserViewModel } from "../../../src/users/output/userViewModel";
import { userDto } from "./userDto";
import { USERS_PATH } from "../../../src/users/constants/users.paths";

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
