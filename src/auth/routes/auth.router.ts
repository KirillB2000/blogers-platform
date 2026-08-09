import { Router } from "express";
import { AUTH_ROUTING } from "../constants/auth.paths";
import { authDtoValidation } from "../validation/auth.validation";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { authHandler } from "./handlers/auth.handler";
import { catchAsync } from "../../core/helpers/catchAsync.helper";
import { accessTokenGuardMiddleware } from "../middlewares/access-token.guard.middleware";
import { meHandler } from "./handlers/me.handler";

export const authRouter = Router({})

authRouter
    .post(
        AUTH_ROUTING.LOGIN,
        authDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(authHandler)
    )

    .get(
        AUTH_ROUTING.ME,
        accessTokenGuardMiddleware,
        catchAsync(meHandler)
    )