import { Request, Response } from "express";
import { LoginInputModel } from "../../dto/authInputModel";
import { authService } from "../../application/auth.service";
import { httpStatuses } from "../../../core/types/http-statuses";

export const authHandler = async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response
) => {
    await authService.checkUserCredentials(req.body)

    res.sendStatus(httpStatuses.NoContent)
}