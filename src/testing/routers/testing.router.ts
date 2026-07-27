import { Router } from "express";
import { TESTING_ROUTES } from "../constants/testing.paths";
import { testingDeleteAllDataHandler } from "./handlers/testingDeleteAllData.handler";
import { catchAsync } from "../../core/helpers/catchAsync.helper";

export const testingRouter = Router({});

testingRouter.delete(TESTING_ROUTES.ALL_DATA, catchAsync(testingDeleteAllDataHandler));
