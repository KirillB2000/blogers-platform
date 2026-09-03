import { Router } from "express";
import { getCommentByIdHandler } from "./handlers/getCommentById.handler";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id.validation.middleware";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { accessTokenGuardMiddleware } from "../../auth/api/guards/access-token.guard.middleware";
import { COMMENTS_ROUTES } from "../constants/comments.paths";
import { commentInputDtoValidation } from "../validation/commentInput.validation";
import { deleteCommentByIdHandler } from "./handlers/deleteCommentById.handler";
import { updateCommentByIdHandler } from "./handlers/updateCommentById.handler";

export const commentsRouter = Router({})

commentsRouter

    .get(
        COMMENTS_ROUTES.BY_ID,
        idValidation(PARAMS_IDS.ID),
        inputValidationResultMiddleware,
        catchAsync(getCommentByIdHandler)
    )

    .delete(
        COMMENTS_ROUTES.BY_COMMENT_ID,
        accessTokenGuardMiddleware,
        idValidation(PARAMS_IDS.COMMENT_ID),
        inputValidationResultMiddleware,
        catchAsync(deleteCommentByIdHandler)
    )

    .put(
        COMMENTS_ROUTES.BY_COMMENT_ID,
        accessTokenGuardMiddleware,
        idValidation(PARAMS_IDS.COMMENT_ID),
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(updateCommentByIdHandler)
    )