import { Request, Response } from "express"
import { UnauthorizedError } from "../../../../core/exceptions/app-errors.exeption"
import { securityDevicesQueryService } from "../../application/queries/securityDevices.queryServices"
import { httpStatuses } from "../../../../core/types/http-statuses"

export const getSecurityDevicesListHandler = async (
    req: Request,
    res: Response
) => {
    const { refreshToken } = req.cookies as AuthCookies

    if (!refreshToken) {
        throw new UnauthorizedError('Unauthorized')
    }

    const activeSessionDevicesList = await securityDevicesQueryService.listingActiveSessionDevices(refreshToken)

    res.status(httpStatuses.Ok).json(activeSessionDevicesList) 
}