import { Request, Response, NextFunction } from "express";
import { httpStatuses } from "../../core/types/http-statuses";
import { jwtService } from "../adapters/jwt.services";
import { IdType } from "../../core/types/id";

export const accessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    if (!req.headers.authorization) return res.sendStatus(httpStatuses.Unauthorized)

    const [authType, token] = req.headers.authorization.split(' ')

    if (authType !== 'Bearer' || !token) return res.sendStatus(httpStatuses.Unauthorized)

    const payload = await jwtService.getUserIdByToken(token)
    if (payload) {
        const {userId} = payload

        req.user = { id: userId } as IdType
        next()

        return
    }

    res.sendStatus(httpStatuses.Unauthorized)
    return
}