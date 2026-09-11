import { Request, Response, NextFunction } from "express";
import { rateLimitRepository } from "./infrastructure/rateLimit.repository";
import { httpStatuses } from "../../types/http-statuses";

export const rateLimitMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const ipAddress = req.ip || 'Unknown ip address'
    const url = req.originalUrl
    const date = new Date()
    const seconds = 10
    
    await rateLimitRepository.create(ipAddress, url, date)

    const requestsCount = await rateLimitRepository.getRequestsCountInTimeWindow(ipAddress, url, seconds)

    if (requestsCount > 5) {
        return res.sendStatus(httpStatuses.TooManyRequests)
    }

    next()
}