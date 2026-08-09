import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { PARAMS_IDS } from "../../core/types/paramsIds";
import { commentInputDtoValidation } from "../validation/commentInput.validation";
import { getCommentByIdHandler } from "./handlers/getCommentById.handler";
import { COMMENTS_ROUTES } from "../constants/comments.paths";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";

export const commentsRouter = Router({})

commentsRouter.
    get(
        COMMENTS_ROUTES.BY_ID,
        idValidation(PARAMS_IDS.ID),
        inputValidationResultMiddleware,
        getCommentByIdHandler
    )