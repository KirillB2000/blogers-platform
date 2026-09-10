import { Request, Response } from "express"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { securityDevicesServices } from "../../application/commands/securityDevices.services"

export const deleteAllDeviceSessionsHandler = async (
    req: Request,
    res: Response
) => {
    const { refreshToken } = req.cookies as AuthCookies

    if (!refreshToken) {
        return res.sendStatus(httpStatuses.Unauthorized)
    }

    await securityDevicesServices.deleteAllSessions(refreshToken)

    res.sendStatus(httpStatuses.NoContent)
}