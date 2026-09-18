import { RequestHandler, Router } from "express";
import { USERS_ROUTING } from "../constants/users.paths";
import { userDtoValidation } from "../validation/user-input.validation";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { idParamsValidation } from "../../../core/middlewares/validation/params-id.validation.middleware";
import { paginationAndSortingValidation } from "../../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { sanitizeQueryParams } from "../../../core/middlewares/validation/sanitize-query.middleware";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { superAdminGuardMiddleware } from "../../auth/api/guards/super-admin.guard.middleware";
import { UserSortFields } from "./input/user-sort-fields";
import { container } from "../../../compostion-root";
import { UsersController } from "./users.controller";

export const userRouter = Router({})

const usersController = container.get(UsersController)

userRouter
    .post(
        USERS_ROUTING.ROOT,
        superAdminGuardMiddleware,
        userDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(usersController.createUserHandler.bind(usersController))
    )

    .delete(
        USERS_ROUTING.BY_ID,
        superAdminGuardMiddleware,
        idParamsValidation(PARAMS_IDS.ID),
        inputValidationResultMiddleware,
        catchAsync(usersController.deleteUserHandler.bind(usersController))
    )

    .get(
        USERS_ROUTING.ROOT,
        superAdminGuardMiddleware,
        paginationAndSortingValidation(UserSortFields),
        sanitizeQueryParams,
        catchAsync(usersController.getUserListHandler.bind(usersController) as unknown as RequestHandler)
    )