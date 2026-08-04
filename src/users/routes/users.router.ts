import { RequestHandler, Router } from "express";
import { USERS_ROUTING } from "../constants/users.paths";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard.middleware";
import { userDtoValidation } from "../validation/user-input.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { createUserHandler } from "./handlers/createUser.handler";
import { catchAsync } from "../../core/helpers/catchAsync.helper";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { deleteUserHandler } from "./handlers/deleteUser.handler";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query.middleware";
import { UserSortFields } from "../input/user-sort-fields";
import { getUserListHandler } from "./handlers/getUserList.handler";

export const userRouter = Router({})

userRouter
    .post(
        USERS_ROUTING.ROOT,
        superAdminGuardMiddleware,
        userDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(createUserHandler)
    )

    .delete(
        USERS_ROUTING.BY_ID,
        idValidation('id'),
        superAdminGuardMiddleware,
        inputValidationResultMiddleware,
        catchAsync(deleteUserHandler)
    )

    .get(
        USERS_ROUTING.ROOT,
        superAdminGuardMiddleware,
        paginationAndSortingValidation(UserSortFields),
        sanitizeQueryParams,
        catchAsync(getUserListHandler as unknown as RequestHandler)
    )