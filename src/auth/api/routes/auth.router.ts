import { Router } from "express";
import { loginHandler } from "./handlers/login.handler";
import { accessTokenGuardMiddleware } from "../guards/access-token.guard.middleware";
import { meHandler } from "./handlers/me.handler";
import { registrationHandler } from "./handlers/registration.handler";
import { registrationConfirmationHandler } from "./handlers/registrationConfirmation.handler";
import { registrationEmailResendingHandler } from "./handlers/registrationEmailResending.handler";
import { refreshTokenHadler } from "./handlers/refreshToken.handler";
import { AUTH_ROUTING } from "../../constants/auth.paths";
import { loginDtoValidation } from "../../validation/loginInput.validation";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { userDtoValidation, emailValidation } from "../../../users/validation/user-input.validation";
import { codeDtoValidation } from "../../validation/codeInput.validation";
import { logoutHandler } from "./handlers/logout.handler";

export const authRouter = Router({})

authRouter
    .post(
        AUTH_ROUTING.LOGIN,
        loginDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(loginHandler)
    )

    .get(
        AUTH_ROUTING.ME,
        accessTokenGuardMiddleware,
        catchAsync(meHandler)
    )
    
    // User registration
    .post(
        AUTH_ROUTING.REGISTRATION,
        userDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(registrationHandler)
    )

    // User confirmation registration
    .post(
        AUTH_ROUTING.REGISTRATION_CONFIRMATION,
        codeDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(registrationConfirmationHandler)
    )

    // Resending email to user
    .post(
        AUTH_ROUTING.REGISTRATION_EMAIL_RESENDING,
        emailValidation,
        inputValidationResultMiddleware,
        catchAsync(registrationEmailResendingHandler)
    )

    .post(
        AUTH_ROUTING.REFRESH_TOKEN,
        catchAsync(refreshTokenHadler)
    )

    .post(
        AUTH_ROUTING.LOGOUT,
        catchAsync(logoutHandler)
    )