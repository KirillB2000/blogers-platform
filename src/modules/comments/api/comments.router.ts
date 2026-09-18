import { Router } from "express";
import { catchAsync } from "../../../core/helpers/catchAsync.helper";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idParamsValidation } from "../../../core/middlewares/validation/params-id.validation.middleware";
import { PARAMS_IDS } from "../../../core/types/paramsIds";
import { accessTokenGuardMiddleware } from "../../auth/api/guards/access-token.guard.middleware";
import { COMMENTS_ROUTES } from "../constants/comments.paths";
import { commentInputDtoValidation } from "../validation/commentInput.validation";
import { container } from "../../../compostion-root";
import { CommentsController } from "./comments.controller";

export const commentsRouter = Router({})

const commentsController = container.get(CommentsController)


commentsRouter

    .get(
        COMMENTS_ROUTES.BY_ID,
        idParamsValidation(PARAMS_IDS.ID),
        inputValidationResultMiddleware,
        catchAsync(commentsController.getCommentByIdHandler.bind(commentsController))
    )

    .delete(
        COMMENTS_ROUTES.BY_COMMENT_ID,
        accessTokenGuardMiddleware,
        idParamsValidation(PARAMS_IDS.COMMENT_ID),
        inputValidationResultMiddleware,
        catchAsync(commentsController.deleteCommentByIdHandler.bind(commentsController))
    )

    .put(
        COMMENTS_ROUTES.BY_COMMENT_ID,
        accessTokenGuardMiddleware,
        idParamsValidation(PARAMS_IDS.COMMENT_ID),
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        catchAsync(commentsController.updateCommentByIdHandler.bind(commentsController))
    )