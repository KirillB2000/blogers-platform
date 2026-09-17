import { Router } from "express";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { userDtoValidation, emailValidation, passwordValidation } from "../../users/validation/user-input.validation";
import { AUTH_ROUTING } from "../constants/auth.paths";
import { loginDtoValidation } from "../validation/loginInput.validation";
import { accessTokenGuardMiddleware } from "./guards/access-token.guard.middleware";
import { rateLimitMiddleware } from "../../../core/middlewares/rateLimiter/rateLimit.middleware";
import { authController } from "../../../compostion-root";
import { codeDtoValidation } from "../validation/codeInput.validation";
import { CODE_NAMES } from "../../../core/types/codeNames";

export const authRouter = Router({})

authRouter
    .post(
        AUTH_ROUTING.LOGIN,
        rateLimitMiddleware,
        loginDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(authController.loginHandler.bind(authController))
    )

    .get(
        AUTH_ROUTING.ME,
        accessTokenGuardMiddleware,
        catchAsync(authController.meHandler.bind(authController))
    )
    
    // User registration
    .post(
        AUTH_ROUTING.REGISTRATION,
        rateLimitMiddleware,
        userDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(authController.registrationHandler.bind(authController))
    )

    // User confirmation registration
    .post(
        AUTH_ROUTING.REGISTRATION_CONFIRMATION,
        rateLimitMiddleware,
        codeDtoValidation(CODE_NAMES.CODE),
        inputValidationResultMiddleware,
        catchAsync(authController.registrationConfirmationHandler.bind(authController))
    )

    // Resending email to user
    .post(
        AUTH_ROUTING.REGISTRATION_EMAIL_RESENDING,
        rateLimitMiddleware,
        emailValidation,
        inputValidationResultMiddleware,
        catchAsync(authController.registrationEmailResendingHandler.bind(authController))
    )

    .post(
        AUTH_ROUTING.REFRESH_TOKEN,
        catchAsync(authController.refreshTokenHandler.bind(authController))
    )

    .post(
        AUTH_ROUTING.LOGOUT,
        catchAsync(authController.logoutHandler.bind(authController))
    )

    .post(
        AUTH_ROUTING.PASSWORD_RECOVERY,
        rateLimitMiddleware,
        emailValidation,
        catchAsync(authController.passwordRecoveryHandler.bind(authController))
    )

    .post(
        AUTH_ROUTING.NEW_PASSWORD,
        rateLimitMiddleware,
        codeDtoValidation(CODE_NAMES.RECOVERY_CODE),
        passwordValidation,
        catchAsync(authController.updatePasswordHandler.bind(authController))
    )